```
STUDENT ID          20041596
MODULE ID           5Z6Z1005_2425_1F
ASSESSMENT ID       1CWK60
```

# Carder Frontend SPA

## Hosting
Since this is a single page application (SPA), it can be compiled to static files and hosted on any server. GitHub pages is used for this project.
The project is available at: [https://github.chrisyalamov.space](https://github.chrisyalamov.space).

## Test credentials
Please create an account to test the application. When asked for a confirmation code, use `445566`.

You can then use your password, or the code `000000` to log in.

For payments, you can use the card number `4242 4242 4242 4242` with any future expiration date and any CVC code. This is a test card provided by Stripe, the payment processor used in this project. You can see more information about test cards in the [Stripe documentation](https://stripe.com/docs/testing).

> WARNING: While this project runs Stripe in test mode, you should NOT use any real card information. Please be aware of auto-fill.

## Tech stack
- React
- Tanstack Router
- Tanstack Query
- Tailwind CSS

## Use of utility-first CSS
This project uses Tailwind CSS, a utility-first CSS framework. This means that instead of writing custom CSS for each component, pre-defined utility classes are used to style components. This approach allows for rapid development and easy maintenance of styles.

It may look different to traditional CSS, but it is a powerful way to build responsive and maintainable user interfaces, and widely adopted in React projects.
