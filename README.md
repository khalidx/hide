# hide

<img src="logo-color.png" alt="hide - Powerful, simple, durable secrets management.">

```sh
hide
hide show
hide run
```

*Quickstart*

1) Just type `hide` to make your `.secrets/` directory dissapear.
2) Type `hide show` to bring it back.
3) Using `hide run` lets you spawn a shell to run any command with your secrets automatically injected as environment variables.

*Documentation*

| Command     | Description                                                                                    | Source                         |
| ----------- | ---------------------------------------------------------------------------------------------- | ------------------------------ |
| `hide`      | Encrypts and backs up all secret files to the cloud, and removes them.                         | [hide.ts](./hide.ts)           |
| `hide show` | Retrieves all secrets from the cloud, and decrypts them.                                       | [hide-show.ts](./hide-show.ts) |
| `hide run`  | Spawns a shell to run the provided command with all secrets provided as environment variables. | [hide-run.ts](./hide-run.ts)   |

*Notes*

- Authentication and authorization is based on the current logged-in IAM profile.

*Todo*

- [ ] S3 bucket configuration with encryption and versioning
- [ ] Permissions/roles
- [ ] Sharing
- [ ] Locking
- [ ] Encryption in-transit and at-rest
- [ ] Multiple users?
