<script>
    export let value = "";

    function copyToClipboard() {
        navigator.clipboard.writeText(value);
    }

</script>

<a href="/" on:click|preventDefault={() => copyToClipboard()}><i class="bi-clipboard-data link-dark" title="Copy to Clipboard"></i></a>