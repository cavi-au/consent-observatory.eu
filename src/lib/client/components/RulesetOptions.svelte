<script>
    import Tooltip from "sv-tooltip";
    
    export let form;
    export let options;
    export let selectedCheckboxes;
    export let selectedRadios;
    export let sectionTitle = undefined;
    export let sectionKey;

    let children = [];

    export function toggleAllCheckboxes(event) {
        let checkboxStatus = event.target.checked;
        for (let rulesetOption of options) {
            if (rulesetOption.type === 'checkbox') {
                if (checkboxStatus) {
                    selectedCheckboxes.add(`rulesetOption.${rulesetOption.key}`);
                } else {
                    selectedCheckboxes.delete(`rulesetOption.${rulesetOption.key}`);
                }
            }
        }

        selectedCheckboxes = selectedCheckboxes;
        for (let child of children) {
            child.toggleAllCheckboxes(checkboxStatus);
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
    <h6 class="sub-legend mt-4">{sectionTitle}
        <input id="toggleAll-{sectionKey}" type="checkbox" class="form-check-input ms-2 text-muted" on:click={(e) => toggleAllCheckboxes(e)}>
        <label for="toggleAll-{sectionKey}"><small class="text-muted">Toggle all</small></label>
    </h6>

{/if}
<div>
    {#each options as rulesetOption}
        {@const optionKey = `rulesetOption.${rulesetOption.key}`}
        {#if rulesetOption.title && rulesetOption.type !== 'section'}
            <p class="form-label">{rulesetOption.title}</p>
        {/if}
        {#if rulesetOption.type === 'checkbox'}
            <div class="form-check">
                <input type="checkbox" checked={selectedCheckboxes.has(optionKey)} class="form-check-input" name="{optionKey}"
                       id="{optionKey}" on:click={(event) => checkboxChanged(optionKey, event.target.checked)}>
                <label class="form-check-label ms-2" for="{optionKey}">{rulesetOption.label}</label>
                {#if rulesetOption.description}
                    <Tooltip tip={rulesetOption.description} top>
                    <small><i class="bi bi-question-circle"></i></small>
                    </Tooltip>
                {/if}
                <!--{#if form?.errors?.[optionKey]}-->
                <!--    <div id="{optionKey}-error" class="invalid-feedback">{form?.errors?.[optionKey]}</div>-->
                <!--{:else if rulesetOption.description}-->
                <!--    <div id="{optionKey}-info" class="form-text">{rulesetOption.description}</div>-->
                <!--{/if}-->
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
            <svelte:self bind:this={children[children.length]} form={form} options={rulesetOption.options} sectionTitle={rulesetOption.title} sectionKey={rulesetOption.key} selectedCheckboxes={selectedCheckboxes} selectedRadios={selectedRadios} />
        {/if}
    {/each}
</div>

