# <%= humanPluginName %>

<%= description %>

## Getting Started

Once you've added the plugin script to your page, you can use it with any video:

```html
<script src="<%= pluginName %>"></script>
<script>
  videojs(document.querySelector('video')).<%= camelPluginName %>();
</script>
```

## Documenation
### Plugin Options

You may pass in an options object to the plugin upon initialization. This
object may contain any of the following properties:

#### option
Type: `boolean`
Default: true

An example boolean option that has no effect.

## Release History

 - 0.1.0: Initial release
