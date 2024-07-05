
# THE homepage
"a beautiful home page for firefox"

Available [here](https://addons.mozilla.org/en-US/firefox/addon/the-homepage/)

# Setting up the extension
- clone the repo
```
git clone https://www.github.com/bendikMichal/the_homepage
```
- cd into the dir
```
cd the_homepage
```

## By signing
- run
```
npx web-ext build
```
- sign it
```
web-ext sign --api-key="key" --api-secret="secret"
```
- go to `web-ext-artifacts` and locate the `.xpi`

## Without signing (requires firefox nightly)
- zip the contents
- rename the `.zip` to `.xpi`
- in `about:config` set `xpinstall.signatures.required` to `false`

- go to `about:addons`
- drag the `.xpi` to the firefox window

