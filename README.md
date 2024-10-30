# A playground for testing data-url-blur images

## data-url-blur

Kinda `show-something-dont-show-nothing` logic. You can show low-res images to the user while you are fetching an actual image.

In order not to make an additional request to the server, you can embed this low-res to the page itself via encoding it to the [data url](https://developer.mozilla.org/en-US/docs/Web/URI/Schemes/data)

## Prehistory

I need a way to find the best encoding options for the blur image. There's actually many options for encoding `jpeg`, `png`, `webp` and it's cool to visually see the differences and image size impact.

## Usage

Inteded only for local use. Run

```bash
yarn install
yarn dev
```

or

```bash
yarn install
yarn build
yarn start
```

## Custom images

Put the in `public/images` directory.
