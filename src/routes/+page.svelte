<script>
    import { JSONEditor } from "svelte-jsoneditor";
    import { parseMsg } from "$lib/index.js";

    let files = $state();
    let content = $state();
    let includeRawPropsValue = $state();
    let ansiEncodingValue = $state();
    let error = $state("");

    $effect(() => {
        error = "";
        if (files && 1 <= files.length) {
            const file = files[0];
            (async () => {
                try {
                    const testMsgInfo = await parseMsg(
                        file,
                        ansiEncodingValue,
                        includeRawPropsValue,
                    );
                    content = {
                        json: testMsgInfo,
                    };
                    console.info(testMsgInfo);
                } catch (e) {
                    error = e + "";
                }
            })();
        }
    });
</script>

<h1>msgreader-web-ng-demo</h1>

<p>
    Quick links: <a
        href="https://github.com/HiraokaHyperTools/msgreader-web-ng_demo"
        target="_blank">msgreader-web-ng-demo</a
    >
</p>

<p>
    Select a msg file:
    <input bind:files id="msg_file" type="file" />
</p>

<p>
    <label for="ansiEncoding">ansiEncoding</label>
    <input
        id="ansiEncoding"
        placeholder="e.g. windows-1251"
        autocomplete="on"
        list="ansiEncodingList"
        bind:value={ansiEncodingValue}
    />
    | See
    <a href="https://encoding.spec.whatwg.org/#names-and-labels" target="_blank"
        >Encoding Standard</a
    >
    for a full list.
    <datalist id="ansiEncodingList">
        <option value="utf-8"></option>
        <option value="ascii"></option>
        <option value="latin1"></option>
        <option value="windows-1251"></option>
        <option value="shift_jis"></option>
    </datalist>
</p>

<p>
    <input
        type="checkbox"
        id="includeRawProps"
        bind:checked={includeRawPropsValue}
    />
    <label for="includeRawProps">includeRawProps</label>
</p>

{#if error}
    <blockquote>
        <strong>Error:</strong>
        <pre>{error}</pre>
    </blockquote>
{/if}

<div>
    <JSONEditor bind:content />
</div>
