# hide

<img src="logo-color.png" alt="hide - Powerful, simple, durable secrets management.">

```sh
hide
hide show
hide list
hide run
hide info
hide destroy
```

*Quickstart*

```sh
npm install -g @khalidx/hide
# or npx @khalidx/hide
```

1) Just type `hide` to make your `.secrets/` directory dissapear.
2) Type `hide show` to bring it back.
3) Using `hide list` lists all your secrets.
4) Using `hide run` lets you spawn a shell to run any command with your secrets automatically injected as environment variables.
5) Type `hide info` to see metadata that `hide` uses, like the local secrets directory and the remote S3 bucket.
6) Type `hide destroy` to delete all stored secrets along with the AWS resources that `hide` uses.

*Documentation*

| Command        | Description                                                                                    | Source                                   |
| -----------    | ---------------------------------------------------------------------------------------------- | ------------------------------           |
| `hide`         | Encrypts and backs up all secret files to the cloud, and removes them.                         | [hide.ts](./src/hide.ts)                 |
| `hide show`    | Retrieves all secrets from the cloud, and decrypts them.                                       | [hide-show.ts](./src/hide-show.ts)       |
| `hide list`    | Retrieves all secrets from the cloud, decrypts them, and lists them on the terminal.           | [hide-list.ts](./src/hide-list.ts)       |
| `hide run`     | Spawns a shell to run the provided command with all secrets provided as environment variables. | [hide-run.ts](./src/hide-run.ts)         |
| `hide info`    | Shows metadata that `hide` uses, like the local secrets directory and the remote S3 bucket.    | [hide-info.ts](./src/hide-info.ts)       |
| `hide destroy` | Deletes all stored secrets along with the AWS resources that `hide` uses.                      | [hide-destroy.ts](./src/hide-destroy.ts) |

*Notes*

- Authentication and authorization is based on the current logged-in IAM profile.

*Todo*

- [ ] S3 bucket configuration with encryption and versioning
- [ ] Permissions/roles
- [ ] Sharing
- [ ] Locking
- [ ] Encryption in-transit and at-rest
- [ ] Multiple users?
- [ ] Remove logo (completely blows up npm package size)
- [ ] Add license
- [ ] instanceof doesn't work for es5