//kept sometihings commented beacuse of mobx to integrate popup functionality here
import React from 'react';
import { Icon, Dialog, Text, MobileFullPageModal, MobileWrapper, DesktopWrapper } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import Recent from './load-bot-preview/recent';
import SaveModalStore from 'Stores/save-modal-store';
import GoogleDrive from './load-bot-preview/google-drive';
import classNames from 'classnames';

type TCardProps = {
    closeResetDialog: VoidFunction;
    dialog_options: { [key: string]: string };
    handleFileChange: (e: React.ChangeEvent, flag?: boolean) => boolean;
    has_dashboard_strategies: boolean;
    is_dialog_open: boolean;
    is_mobile: boolean;
    loadFileFromLocal: VoidFunction;
    save_modal: SaveModalStore;
    setActiveTab: (active_tab: number) => void;
    setFileLoaded: (param: boolean) => void;
    setPreviewOnPopup: (show: boolean) => void;
    showVideoDialog: (param: { [key: string]: string | React.ReactNode }) => void;
};

type TCardArray = {
    icon: string;
    content: string;
    method: VoidFunction;
};

const Card = ({
    closeResetDialog,
    dialog_options,
    handleFileChange,
    has_dashboard_strategies,
    is_dialog_open,
    is_mobile,
    loadFileFromLocal,
    setActiveTab,
    setFileLoaded,
    setPreviewOnPopup,
    showVideoDialog,
}: TCardProps) => {
    /* eslint-disable no-unused-expressions */
    const [file_supported, setIsFileSupported] = React.useState<boolean>(true);
    const file_input_ref = React.useRef<HTMLInputElement | null>(null);

    const openGoogleDriveDialog = () => {
        showVideoDialog({
            type: 'google',
        });
    };

    const openFileLoader = () => {
        file_input_ref?.current?.click();
    };

    const actions: TCardArray[] = [
        {
            icon: is_mobile ? 'IcLocal' : 'IcMyComputer',
            content: is_mobile ? localize('Local') : localize('My computer'),
            method: openFileLoader,
        },
        {
            icon: 'IcGoogleDriveDbot',
            content: localize('Google Drive'),
            method: openGoogleDriveDialog,
        },
        {
            icon: 'IcBotBuilder',
            content: localize('Bot Builder'),
            method: () => setActiveTab(1),
        },
        {
            icon: 'IcQuickStrategy',
            content: localize('Quick Strategy'),
            method: () => setActiveTab(2),
        },
    ];

    return React.useMemo(
        () => (
            <div
                className={classNames('tab__dashboard__table', {
                    'tab__dashboard__table--minimized': has_dashboard_strategies && is_mobile,
                })}
            >
                <div
                    className={classNames('tab__dashboard__table__tiles', {
                        'tab__dashboard__table__tiles--minimized': has_dashboard_strategies && is_mobile,
                    })}
                    id='tab__dashboard__table__tiles'
                >
                    {actions.map(icons => {
                        const { icon, content, method } = icons;
                        return (
                            <div
                                key={content}
                                className={classNames('tab__dashboard__table__block', {
                                    'tab__dashboard__table__block--minimized': has_dashboard_strategies && is_mobile,
                                })}
                            >
                                <Icon
                                    className={classNames('tab__dashboard__table__images', {
                                        'tab__dashboard__table__images--minimized': has_dashboard_strategies,
                                    })}
                                    width='8rem'
                                    height='8rem'
                                    icon={icon}
                                    id={icon}
                                    onClick={method}
                                />
                                <Text color='prominent' size={is_mobile ? 'xxs' : 'xs'}>
                                    {content}
                                </Text>
                            </div>
                        );
                    })}
                    <input
                        type='file'
                        ref={file_input_ref}
                        accept='.xml'
                        hidden
                        onChange={e => {
                            setIsFileSupported(handleFileChange(e, false));
                            loadFileFromLocal();
                            setFileLoaded(true);
                        }}
                    />
                    <DesktopWrapper>
                        <Dialog
                            title={dialog_options.title}
                            is_visible={is_dialog_open}
                            onCancel={closeResetDialog}
                            is_mobile_full_width
                            className='dc-dialog__wrapper--google-drive'
                            has_close_icon
                        >
                            <GoogleDrive />
                        </Dialog>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <MobileFullPageModal
                            is_modal_open={is_dialog_open}
                            className='load-strategy__wrapper'
                            header={localize('Load strategy')}
                            onClickClose={() => {
                                setPreviewOnPopup(false);
                                closeResetDialog();
                            }}
                            height_offset='80px'
                            page_overlay
                        >
                            <div label='Google Drive' className='google-drive-label'>
                                <GoogleDrive />
                            </div>
                        </MobileFullPageModal>
                    </MobileWrapper>
                </div>
                <Recent />
            </div>
        ),
        [is_dialog_open, has_dashboard_strategies]
    );
};

export default connect(({ load_modal, dashboard }: RootStore) => ({
    closeResetDialog: dashboard.onCloseDialog,
    dialog_options: dashboard.dialog_options,
    handleFileChange: load_modal.handleFileChange,
    is_dialog_open: dashboard.is_dialog_open,
    loadFileFromLocal: load_modal.loadFileFromLocal,
    onDriveConnect: load_modal.onDriveConnect,
    setActiveTab: dashboard.setActiveTab,
    setFileLoaded: dashboard.setFileLoaded,
    setLoadedLocalFile: load_modal.setLoadedLocalFile,
    setPreviewOnPopup: dashboard.setPreviewOnPopup,
    showVideoDialog: dashboard.showVideoDialog,
}))(Card);