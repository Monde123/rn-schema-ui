# Design

1. **Schema is source of truth** — types, validation, derived labels.
2. **Readable generated code** — editable after generation.
3. **First-class states** — loading / error / empty / success.
4. **a11y by default** — labels, hints, `accessibilityRole="alert"` on errors; tests use `getByLabelText`.
5. **English defaults** for docs and CLI messages (v0.1).

Screen shell: `KeyboardAvoidingView` + `ScrollView` (`keyboardShouldPersistTaps="handled"`), fields, submit, optional reset.
