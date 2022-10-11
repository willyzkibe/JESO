import * as React from 'react';
import PropTypes from 'prop-types';
import { useHistory, withRouter } from 'react-router-dom';
import { DesktopWrapper, Icon, MobileWrapper, Popover, Text, Button } from '@deriv/components';
import { getPlatformInformation, routes, PlatformContext } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { PlatformSwitcher, ToggleNotifications, MenuLinks } from 'App/Components/Layout/Header';
import platform_config from 'App/Constants/platform-config';
import ToggleMenuDrawer from 'App/Components/Layout/Header/toggle-menu-drawer.jsx';
import { connect } from 'Stores/connect';
import { BinaryLink } from 'App/Components/Routes';
import DerivBrandLogo from 'Assets/SvgComponents/header/deriv-brand-logo.svg';
import DerivBrandLogoDark from 'Assets/SvgComponents/header/deriv-brand-logo-dark.svg';
import RealAccountSignup from 'App/Containers/RealAccountSignup';

const Divider = () => {
    return <div className='trading-hub-header__divider' />;
};

const TradingHubMenuHomepage = () => {
    const history = useHistory();

    return (
        <div className='trading-hub-header__tradinghub' onClick={() => history.push(routes.trading_hub)}>
            <Icon icon='IcAppstoreMenuHomepage' size={30} />
        </div>
    );
};

const RedirectToOldInterface = () => {
    const platform_store = React.useContext(PlatformContext);
    const disablePreAppstore = () => {
        platform_store.setIsPreAppStore(false);
    };
    return (
        <div className='trading-hub-header__redirect'>
            <BinaryLink to={routes.trade} className='trading-hub-header__redirect--link' onClick={disablePreAppstore}>
                <Text as='p' size='xs' color='general'>
                    <Localize i18n_default_text='Back to old interface' />
                </Text>
                <Icon icon='IcArrowRight' size={18} color='red' />
            </BinaryLink>
        </div>
    );
};

const TradingHubOnboarding = ({ is_dark_mode }) => {
    return (
        <div className='trading-hub-header__tradinghub--onboarding'>
            <div className='trading-hub-header__tradinghub--onboarding--logo'>
                <Icon
                    icon={is_dark_mode ? 'IcAppstoreTradingHubOnboardingDark' : 'IcAppstoreTradingHubOnboarding'}
                    size={20}
                />
            </div>
        </div>
    );
};

const ShowNotifications = ({ is_notifications_visible, notifications_count, toggleNotifications }) => {
    return (
        <div className='trading-hub-header__notification'>
            <ToggleNotifications
                count={notifications_count}
                is_visible={is_notifications_visible}
                toggleDialog={toggleNotifications}
                tooltip_message={<Localize i18n_default_text='View notifications' />}
            />
        </div>
    );
};

const TradingHubHeader = ({
    account_status,
    app_routing_history,
    disableApp,
    enableApp,
    header_extension,
    is_dark_mode,
    is_logged_in,
    is_mt5_allowed,
    is_notifications_visible,
    is_onramp_tab_visible,
    is_p2p_enabled,
    is_payment_agent_transfer_visible,
    is_payment_agent_visible,
    is_account_transfer_visible,
    is_virtual,
    location,
    logoutClient,
    notifications_count,
    setDarkMode,
    should_allow_authentication,
    toggleNotifications,
    is_social_signup,
    replaceCashierMenuOnclick,
    menu_items,
}) => {
    const toggle_menu_drawer_ref = React.useRef(null);
    const filterPlatformsForClients = payload =>
        payload.filter(config => {
            if (config.link_to === routes.mt5) {
                return !is_logged_in || is_mt5_allowed;
            }
            return true;
        });
    const history = useHistory();
    const { is_pre_appstore } = React.useContext(PlatformContext);

    return (
        <header className='trading-hub-header'>
            <div className='trading-hub-header__menu-left'>
                <MobileWrapper>
                    <ToggleMenuDrawer
                        ref={toggle_menu_drawer_ref}
                        should_allow_authentication={should_allow_authentication}
                        account_status={account_status}
                        enableApp={enableApp}
                        disableApp={disableApp}
                        location={location}
                        logoutClient={logoutClient}
                        is_dark_mode={is_dark_mode}
                        is_logged_in={is_logged_in}
                        is_p2p_enabled={is_p2p_enabled}
                        is_payment_agent_transfer_visible={is_payment_agent_transfer_visible}
                        is_onramp_tab_visible={is_onramp_tab_visible}
                        is_payment_agent_visible={is_payment_agent_visible}
                        is_account_transfer_visible={is_account_transfer_visible}
                        is_virtual={is_virtual}
                        toggleTheme={setDarkMode}
                        platform_header={getPlatformInformation(app_routing_history).header}
                        platform_switcher={
                            <PlatformSwitcher
                                app_routing_history={app_routing_history}
                                is_mobile
                                platform_config={filterPlatformsForClients(platform_config)}
                                toggleDrawer={toggle_menu_drawer_ref.current?.toggleDrawer}
                            />
                        }
                        is_social_signup={is_social_signup}
                    />
                    {header_extension && is_logged_in && <div>{header_extension}</div>}
                </MobileWrapper>
                <DesktopWrapper>
                    <TradingHubMenuHomepage />
                </DesktopWrapper>
                {is_dark_mode ? (
                    <DerivBrandLogoDark className='trading-hub-header__logo' />
                ) : (
                    <DerivBrandLogo className='trading-hub-header__logo' />
                )}

                {menu_items && is_logged_in && replaceCashierMenuOnclick()}
                <MenuLinks is_logged_in={is_logged_in} items={menu_items} is_pre_appstore={is_pre_appstore} />
            </div>
            <DesktopWrapper>
                <div className='trading-hub-header__menu-right'>
                    <RedirectToOldInterface />
                    <Divider />
                    <TradingHubOnboarding is_dark_mode={is_dark_mode} />
                    <ShowNotifications
                        is_notifications_visible={is_notifications_visible}
                        notifications_count={notifications_count}
                        toggleNotifications={toggleNotifications}
                    />
                    <Popover
                        classNameBubble='account-settings-toggle__tooltip'
                        alignment='bottom'
                        message={<Localize i18n_default_text='Manage account settings' />}
                        should_disable_pointer_events
                        zIndex={9999}
                    >
                        <BinaryLink className='trading-hub-header__setting' to={routes.personal_details}>
                            <Icon icon='IcUserOutline' size={20} />
                        </BinaryLink>
                    </Popover>
                </div>
                <RealAccountSignup />
            </DesktopWrapper>
            <MobileWrapper>
                <div className='trading-hub-header__mobile-parent'>
                    <div className='trading-hub-header__menu-middle'>
                        <TradingHubOnboarding is_dark_mode={is_dark_mode} />
                        <ShowNotifications
                            is_notifications_visible={is_notifications_visible}
                            notifications_count={notifications_count}
                            toggleNotifications={toggleNotifications}
                        />

                        <Popover
                            classNameBubble='account-settings-toggle__tooltip'
                            alignment='bottom'
                            message={<Localize i18n_default_text='Manage account settings' />}
                            should_disable_pointer_events
                            zIndex={9999}
                        >
                            <BinaryLink className='trading-hub-header__setting' to={routes.personal_details}>
                                <Icon icon='IcUserOutline' size={20} />
                            </BinaryLink>
                        </Popover>
                    </div>
                    <div className='trading-hub-header__cashier-button'>
                        <Button primary small onClick={() => history.push(routes.cashier_deposit)}>
                            <Localize i18n_default_text='Cashier' />
                        </Button>
                    </div>
                </div>
                <RealAccountSignup />
            </MobileWrapper>
        </header>
    );
};

TradingHubHeader.propTypes = {
    account_status: PropTypes.object,
    app_routing_history: PropTypes.array,
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    header_extension: PropTypes.any,
    is_dark_mode: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    is_mt5_allowed: PropTypes.bool,
    is_notifications_visible: PropTypes.bool,
    is_onramp_tab_visible: PropTypes.bool,
    is_p2p_enabled: PropTypes.bool,
    is_payment_agent_transfer_visible: PropTypes.bool,
    is_payment_agent_visible: PropTypes.bool,
    is_account_transfer_visible: PropTypes.bool,
    is_virtual: PropTypes.bool,
    logoutClient: PropTypes.func,
    notifications_count: PropTypes.number,
    setDarkMode: PropTypes.func,
    should_allow_authentication: PropTypes.bool,
    toggleNotifications: PropTypes.func,
    is_social_signup: PropTypes.bool,
    location: PropTypes.object,
    settings_extension: PropTypes.array,
    is_settings_modal_on: PropTypes.bool,
    menu_items: PropTypes.array,
    replaceCashierMenuOnclick: PropTypes.func,
};

export default connect(({ client, common, modules, notifications, ui, menu }) => ({
    account_status: client.account_status,
    app_routing_history: common.app_routing_history,
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    header_extension: ui.header_extension,
    is_dark_mode: ui.is_dark_mode_on,
    is_logged_in: client.is_logged_in,
    is_mt5_allowed: client.is_mt5_allowed,
    is_notifications_visible: notifications.is_notifications_visible,
    is_onramp_tab_visible: modules.cashier.onramp.is_onramp_tab_visible,
    is_p2p_enabled: modules.cashier.general_store.is_p2p_enabled,
    is_payment_agent_transfer_visible: modules.cashier.payment_agent_transfer.is_payment_agent_transfer_visible,
    is_payment_agent_visible: modules.cashier.payment_agent.is_payment_agent_visible,
    is_account_transfer_visible: modules.cashier.account_transfer.is_account_transfer_visible,
    is_virtual: client.is_virtual,
    logoutClient: client.logout,
    notifications_count: notifications.filtered_notifications.length,
    setDarkMode: ui.setDarkMode,
    should_allow_authentication: client.should_allow_authentication,
    toggleNotifications: notifications.toggleNotificationsModal,
    is_social_signup: client.is_social_signup,
    menu_items: menu.extensions,
    replaceCashierMenuOnclick: modules.cashier.general_store.replaceCashierMenuOnclick,
}))(withRouter(TradingHubHeader));