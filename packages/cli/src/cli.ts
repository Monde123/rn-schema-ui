import { generate } from './generate.js';
import type { GenerateCliOptions } from './generate.js';

function help(): void {
  console.log(`rn-schema-ui — codegen formulaires React Native

Usage:
  rn-schema-ui init
  rn-schema-ui generate <schema> --out <dir> [options]
  rn-schema-ui --help

Options generate:
  --out <dir>              Répertoire de sortie (requis)
  --adapter plain|paper    UI adapter (défaut: plain)
  --router expo|rn         Stubs navigation (défaut: expo)
  --name <Name>            Nom composant PascalCase
  --dry-run                Affiche sans écrire
  --watch                  Régénère à chaque changement du schéma
`);
}

function getFlag(args: string[], name: string): string | undefined {
  const i = args.indexOf(name);
  if (i >= 0) return args[i + 1];
  return undefined;
}

function has(args: string[], name: string): boolean {
  return args.includes(name);
}

async function runGenerate(opts: GenerateCliOptions, schemaPath: string): Promise<number> {
  try {
    const result = await generate(opts);
    console.log(`✔ Parsed ${result.ir.fields.length} fields from ${schemaPath} (${result.ms}ms)`);
    for (const w of result.ir.warnings) console.warn(`⚠ ${w}`);
    if (opts.dryRun) {
      console.log('Dry-run — fichiers non écrits:');
      for (const f of result.files) console.log(`  - ${f}`);
    } else {
      for (const f of result.files) console.log(`✔ Wrote ${f}`);
    }
    console.log(`✔ Done in ${result.ms}ms`);
    return 0;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`✖ generate a échoué:\n${msg}`);
    return 1;
  }
}

export async function run(argv = process.argv.slice(2)): Promise<number> {
  const cmd = argv[0];
  if (!cmd || cmd === '--help' || cmd === '-h') {
    help();
    return 0;
  }

  if (cmd === 'init') {
    const { writeFileSync, mkdirSync, existsSync } = await import('node:fs');
    const { resolve } = await import('node:path');

    if (!existsSync('rn-schema-ui.config.json')) {
      writeFileSync(
        'rn-schema-ui.config.json',
        JSON.stringify(
          {
            adapter: 'plain',
            router: 'expo',
            locale: 'fr',
            outDir: './app',
            schema: './schemas/example.ts',
          },
          null,
          2,
        ) + '\n',
      );
      console.log('✔ Créé rn-schema-ui.config.json');
    } else {
      console.log('• rn-schema-ui.config.json existe déjà');
    }

    if (!existsSync('schemas')) mkdirSync('schemas', { recursive: true });
    const exampleSchema = resolve('schemas/example.ts');
    if (!existsSync(exampleSchema)) {
      writeFileSync(
        exampleSchema,
        `import { z } from 'zod';

/** Schéma d'exemple — remplacez par le vôtre. */
export const exampleSchema = z.object({
  email: z.string().email('E-mail invalide'),
  password: z.string().min(8, '8 caractères minimum'),
  acceptTerms: z.boolean(),
});

export type Example = z.infer<typeof exampleSchema>;
`,
      );
      console.log('✔ Créé schemas/example.ts');
    } else {
      console.log('• schemas/example.ts existe déjà');
    }

    console.log(`
Prochaine étape:
  node packages/cli/bin/rn-schema-ui.js generate ./schemas/example.ts --out ./app/example --name Example
`);
    console.log('✔ init terminé');
    return 0;
  }

  if (cmd === 'generate') {
    const schemaPath = argv[1];
    const out = getFlag(argv, '--out');
    if (!schemaPath || !out) {
      console.error('Usage: rn-schema-ui generate <schema> --out <dir>');
      return 1;
    }
    const adapter = (getFlag(argv, '--adapter') ?? 'plain') as 'plain' | 'paper';
    const router = (getFlag(argv, '--router') ?? 'expo') as 'expo' | 'rn';
    if (!['plain', 'paper'].includes(adapter)) {
      console.error('--adapter doit être plain|paper');
      return 1;
    }
    if (!['expo', 'rn'].includes(router)) {
      console.error('--router doit être expo|rn');
      return 1;
    }

    const opts: GenerateCliOptions = {
      schemaPath,
      outDir: out,
      adapter,
      router,
      dryRun: has(argv, '--dry-run'),
      name: getFlag(argv, '--name'),
    };

    if (has(argv, '--watch')) {
      const { watch } = await import('node:fs');
      const { resolve } = await import('node:path');
      const abs = resolve(schemaPath);
      console.log(`👀 watch ${abs} → ${out}`);
      let running = false;
      let queued = false;
      const tick = async () => {
        if (running) {
          queued = true;
          return;
        }
        running = true;
        await runGenerate(opts, schemaPath);
        running = false;
        if (queued) {
          queued = false;
          await tick();
        }
      };
      await tick();
      const watcher = watch(abs, { persistent: true }, () => {
        void tick();
      });
      await new Promise<void>(() => {
        // keep process alive until SIGINT
        process.on('SIGINT', () => {
          watcher.close();
          process.exit(0);
        });
      });
      return 0;
    }

    return runGenerate(opts, schemaPath);
  }

  console.error(`Commande inconnue: ${cmd}`);
  help();
  return 1;
}
