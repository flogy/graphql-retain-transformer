> 🚨 Prevent losing production data by enabling the retain deletion policy for your AWS Amplify API!

# graphql-retain-transformer

[![Pull requests are welcome!](https://img.shields.io/badge/PRs-welcome-brightgreen)](#contribute-)
[![npm](https://img.shields.io/npm/v/graphql-retain-transformer)](https://www.npmjs.com/package/graphql-retain-transformer)
[![GitHub license](https://img.shields.io/github/license/flogy/graphql-retain-transformer)](https://github.com/flogy/graphql-retain-transformer/blob/master/LICENSE)

## What problem does it solve?

The GraphQL Retain transformer is a custom directive that you can install and use in your
AWS Amplify API schema. It will then set the `DeletionPolicy` of the created DynamoDB
tables from the default `Delete` to `Retain`.

What this does is it will make sure that those resources and its contents are not getting
removed during a stack deletion. The deletion process will run through successfully, but
you can still find the old DynamoDB table in your AWS admin console.

**Attention:** If you create a new DynamoDB table with the exact same name, it will then
overwrite the retained table and its data! So creating backups are still a good thing to
do from time to time 😉

Read this blog post about this directive for more information: https://react-freelancer.ch/blog/amplify-retain-dynamodb-tables

## Installation

`npm install --save graphql-retain-transformer`

For projects using the old GraphQL Transformer v1 run:

`npm install --save graphql-retain-transformer@1`

## How to use

### Setup custom transformer

Edit `amplify/backend/api/<YOUR_API>/transform.conf.json` and append `"graphql-retain-transformer"` to the `transformers` field.

```json
"transformers": [
    "graphql-retain-transformer"
]
```

### Use @retain directive

Append `@retain` to target types.

```graphql
type Todo @model @retain {
  id: ID!
  title: String!
  description: String
}
```

## How does it work behind the scenes?

This custom directive just sets the `DeletionPolicy` of the created DynamoDB tables from the default `Delete` to `Retain`.

Read more about the `DeletionPolicy` in the AWS docs: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html

## Contribute 🦸

Contributions are more than welcome! I love how AWS Amplify helps us developers building great apps in a short time. That's why I'd like to give back with contributions like this. If you feel the same and would like to join me in this project it would be awesome to get in touch! 😊

Please feel free to create, comment and of course solve some of the issues. To get started you can also go for the easier issues marked with the `good first issue` label if you like.

### Development

1. Clone this repository and open it in your code editor.
2. Run `npm link` in the cloned project directory and `npm link graphql-retain-transformer` in your test project where you want to use it. Maybe you'll have to uninstall the previously installed dependency as installed from NPM repository.
3. Run `npm start` in your cloned project directory. Every code change is now immediately used in your test project, so you can just modify code and test it using `amplify codegen models` or `amplify push`.

**Hint:** It is important to always make sure the version of the installed `graphql` dependency matches the `graphql` version the `graphql-transformer-core` depends on.

### Publish new NPM package version

1. Make sure version number is updated.
2. Run `npm publish`.
3. Create new release in GitHub including a tag.

## License

The [MIT License](LICENSE)

## Credits

The _graphql-retain-transformer_ library is maintained and sponsored by the Swiss web and mobile app development company [Florian Gyger Software](https://floriangyger.ch).

If this library saved you some time and money please consider [sponsoring me](https://github.com/sponsors/flogy), so I can build more libraries for free and actively maintain them for you. Thank you 🙏
