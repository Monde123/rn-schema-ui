# GitHub metadata

Le fichier de workflow CI n’est **pas** poussé ici : le token utilisé pour le push n’a pas le scope `workflow` (403 sur `.github/workflows/*`).

Workflow de référence versionné : [`docs/ci.github-actions.yml`](../docs/ci.github-actions.yml).  
Pour activer Actions : ajouter le scope `workflow` au PAT, copier ce fichier vers `.github/workflows/ci.yml`, puis commit/push.
