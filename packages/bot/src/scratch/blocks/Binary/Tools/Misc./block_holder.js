// import ScratchStore          from '../../../../../stores/scratch-store';
import { localize }          from 'deriv-translations/src/i18next/i18n';
import { setBlockTextColor } from '../../../../utils';

Blockly.Blocks.block_holder = {
    init() {
        this.jsonInit(this.definition());
    },
    definition() {
        return {
            message0: localize('Ignore %1 %2'),
            args0   : [
                {
                    type: 'input_dummy',
                },
                {
                    type : 'input_statement',
                    name : 'USELESS_STACK',
                    check: null,
                },
            ],
            colour         : Blockly.Colours.RootBlock.colour,
            colourSecondary: Blockly.Colours.RootBlock.colourSecondary,
            colourTertiary : Blockly.Colours.RootBlock.colourTertiary,
            tooltip        : localize('Put your blocks in here to prevent them from being removed'),
            category       : Blockly.Categories.Miscellaneous,
        };
    },
    meta() {
        return {
            'display_name': localize('Ignore'),
            'description' : localize('In case if you want to temporarily exclude some blocks from your scenario, you can simply put them inside of this block. They won’t be executed.'),
        };
    },
    onchange() {
        // TODO: incomment this when the dark mode is done
        //        if (!ScratchStore.instance.root_store.core.ui.is_dark_mode_on) {
        setBlockTextColor(this);
        //        }

    },
};

Blockly.JavaScript.block_holder = () => '';
