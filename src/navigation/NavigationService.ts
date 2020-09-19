import { CommonActions, StackActions, NavigationContainerRef, DrawerActions } from '@react-navigation/native';

let navigator: NavigationContainerRef;

function setTopLevelNavigator(navigatorRef: NavigationContainerRef): void {
    navigator = navigatorRef;
}

function setParams(params: object) {
    navigator.dispatch(CommonActions.setParams(params));
}

function navigate(name: string, params: object = {}, key?: any): void {
    navigator.dispatch(CommonActions.navigate({ name, params, ...(!!key && { key }) }));
}

function goBack(): void {
    navigator.dispatch(CommonActions.goBack());
}

function pop(numberPop: number = 1): void {
    navigator.dispatch(StackActions.pop(numberPop));
}

function push(name: string, params: object = {}): void {
    navigator.dispatch(StackActions.push(name, params));
}

function openDrawer(): void {
    navigator.dispatch(DrawerActions.openDrawer());
}

function closeDrawer(): void {
    navigator.dispatch(DrawerActions.closeDrawer());
}

function toggleDrawer(): void {
    navigator.dispatch(DrawerActions.toggleDrawer());
}

function getCurrentOptions(): object | undefined {
    return navigator.getCurrentOptions();
}

function getCurrentRoute(): object | undefined {
    return navigator.getCurrentRoute();
}

const NavigationService = {
    goBack,
    navigate,
    setTopLevelNavigator,
    pop,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    setParams,
    getCurrentOptions,
    getCurrentRoute,
    push,
};

export default NavigationService;
