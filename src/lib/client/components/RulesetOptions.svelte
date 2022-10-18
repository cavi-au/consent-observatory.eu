<script>
    export let form;
    export let options;
    export let selectedCheckboxes;
    export let selectedRadios;
    export let sectionTitle = undefined;

    let children = [];

    export function selectAllCheckboxes(selectAll) {
        for (let rulesetOption of options) {
            if (rulesetOption.type === 'checkbox') {
                if (selectAll) {
                    selectedCheckboxes.add(`rulesetOption.${rulesetOption.key}`);
                } else {
                    selectedCheckboxes.delete(`rulesetOption.${rulesetOption.key}`);
                }
            }
        }

        selectedCheckboxes = selectedCheckboxes;
        for (let child of children) {
            child.selectAllCheckboxes(selectAll);
        }
    }

    function checkboxChanged(key, selected) {
        if (selected) {
            selectedCheckboxes.add(key);
        } else {
            selectedCheckboxes.delete(key);
        }
        selectedCheckboxes = selectedCheckboxes;
    }

    function radioChanged(key, value) {
        selectedRadios.set(key, value);
        selectedRadios = selectedRadios;
    }
</script>

{#if sectionTitle}
    <legend class="sub-legend">{sectionTitle}
        <button class="btn btn-primary btn-sm ms-2" title="Select All" on:click|preventDefault={() => selectAllCheckboxes(true)}><i class="bi bi-check2-square"></i></button>
        <button class="btn btn-primary btn-sm" title="Deselect All" on:click|preventDefault={() => selectAllCheckboxes(false)}><i class="bi bi-square"></i></button>
    </legend>
{/if}
<div class:ms-4={sectionTitle}>
    {#each options as rulesetOption}
        {@const optionKey = `rulesetOption.${rulesetOption.key}`}
        {#if rulesetOption.title && rulesetOption.type !== 'section'}
            <p class="form-label">{rulesetOption.title}</p>
        {/if}
        {#if rulesetOption.type === 'checkbox'}
            <div class="mb-3 form-check">
                <input type="checkbox" checked={selectedCheckboxes.has(optionKey)} class="form-check-input" name="{optionKey}"
                       id="{optionKey}" on:click={(event) => checkboxChanged(optionKey, event.target.checked)}>
                <label class="form-check-label" for="{optionKey}">{rulesetOption.label}</label>
                {#if form?.errors?.[optionKey]}
                    <div id="{optionKey}-error" class="invalid-feedback">{form?.errors?.[optionKey]}</div>
                {:else if rulesetOption.description}
                    <div id="{optionKey}-info" class="form-text">{rulesetOption.description}</div>
                {/if}
            </div>
        {:else if rulesetOption.type === 'radio'}
            {#each rulesetOption.options as radioOption, i}
                <div class="form-check">
                    <input class="form-check-input" type="radio" checked={selectedRadios.get(optionKey) === radioOption.value} name="{optionKey}"
                           value="{radioOption.value}" id="{optionKey}-{i}" on:click={(event) => radioChanged(optionKey, radioOption.value)}>
                    <label class="form-check-label" for="{optionKey}-{i}">{radioOption.label}</label>

                    {#if i === rulesetOption.options.length - 1}
                        <div class="mb-3">
                            {#if form?.errors?.[optionKey]}
                                <div id="{optionKey}-error" class="invalid-feedback">{form?.errors?.[optionKey]}</div>
                            {:else if rulesetOption.description}
                                <div id="{optionKey}-info" class="form-text">{rulesetOption.description}</div>
                            {/if}
                        </div>
                    {/if}
                </div>
            {/each}
        {:else if rulesetOption.type === 'section'}
            <svelte:self bind:this={children[children.length]} form={form} options={rulesetOption.options} sectionTitle={rulesetOption.title} selectedCheckboxes={selectedCheckboxes} selectedRadios={selectedRadios} />
        {/if}
    {/each}
</div>

