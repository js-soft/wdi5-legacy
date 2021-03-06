const wdi5 = require('wdi5');
const Main = require('./pageObjects/Main');

describe('check the generated methods on the control -> ', () => {
    const buttonSelector = {
        selector: {
            id: 'NavFwdButton',
            viewName: 'test.Sample.view.Main'
        }
    };

    const inputSelector = {
        selector: {
            id: 'mainUserInput',
            viewName: 'test.Sample.view.Main'
        }
    };

    const dateTimeSelector = {
        selector: {
            id: 'idDateTime',
            viewName: 'test.Sample.view.Main'
        }
    };

    const listSelector = {
        selector: {
            id: 'PeopleList',
            viewName: 'test.Sample.view.Other'
        }
    };

    const checkboxSelector = {
        selector: {
            id: 'idCheckbox',
            viewName: 'test.Sample.view.Main'
        }
    };

    before(async () => {
        if ((await browser.getUI5VersionAsFloat()) <= 1.6) {
            buttonSelector.forceSelect = true;
            buttonSelector.selector.interaction = 'root';
            inputSelector.forceSelect = true;
            inputSelector.selector.interaction = 'root';
            dateTimeSelector.forceSelect = true;
            dateTimeSelector.selector.interaction = 'root';
            listSelector.forceSelect = true;
            listSelector.selector.interaction = 'root';
            checkboxSelector.forceSelect = true;
            checkboxSelector.selector.interaction = 'root';
        }

        await Main.open();
    });

    beforeEach(async () => {
        (await wdi5()).getUtils().takeScreenshot('test-ui5');
    });

    afterEach(async () => {
        (await wdi5()).getUtils().takeScreenshot('test-ui5');
    });

    it('navigation button w/ text exists', async () => {
        const button = await browser.asControl(buttonSelector);
        expect(await button.getProperty('text')).toEqual('to Other view');
    });

    it('getProperty("text") and getText() are equivalent', async () => {
        const button = await browser.asControl(buttonSelector);
        expect(await button.getProperty('text')).toEqual(await button.getText());
    });

    it('sets the property of a control successfully', async () => {
        const button = await browser.asControl(buttonSelector);
        await button.setProperty('text', 'new button text');
        expect(await button.getText()).toEqual('new button text');
    });

    it('ui5 input method test', async () => {
        const input = await browser.asControl(inputSelector);

        // text
        const inputText = 'the mighty text';
        await input.setValue(inputText);
        const sTextProperty = await input.getProperty('value');
        expect(await input.getValue()).toEqual(sTextProperty);
        expect(await input.getValue()).toEqual(inputText);

        // status enabled
        expect(await input.getEnabled()).toBeTruthy();
        await input.setEnabled(false);
        expect(await input.getEnabled()).toBeFalsy();
        await input.setEnabled(true);

        // status editable
        expect(await input.getEditable()).toBeTruthy();
        await input.setEditable(false);
        expect(await input.getEditable()).toBeFalsy();
    });

    it('ui5 button method test', async () => {
        const button = await browser.asControl(buttonSelector);

        // text
        const buttonText = 'the mighty text';
        await button.setText(buttonText);
        const retrievedButtonText = await button.getText();
        expect(retrievedButtonText).toEqual(await button.getProperty('text'));
        expect(retrievedButtonText).toEqual(buttonText);

        // status
        expect(await button.getEnabled()).toBeTruthy();
        await button.setEnabled(false);
        expect(await button.getEnabled()).toBeFalsy();
    });

    it('ui5 checkbox method test', async () => {
        const checkbox = await browser.asControl(checkboxSelector);

        // select
        await checkbox.setSelected(true);
        expect(await checkbox.getPartiallySelected()).toBeFalsy();
        expect(await checkbox.getSelected()).toBeTruthy();
        await checkbox.setPartiallySelected(true);
        expect(await checkbox.getPartiallySelected()).toBeTruthy();

        // status
        expect(await checkbox.getEnabled()).toBeTruthy();
        await checkbox.setEnabled(false);
        expect(await checkbox.getEnabled()).toBeFalsy();
    });

    it('ui5 dateTime method test', async () => {
        const dateTimeField = await browser.asControl(dateTimeSelector);

        // datetime input
        const date = new Date();
        await dateTimeField.setValue(date);
        const value = await dateTimeField.getValue();
        expect(value).toEqual(date.toISOString());

        // status
        expect(await dateTimeField.getEnabled()).toBeTruthy();
        await dateTimeField.setEnabled(false);
        expect(await dateTimeField.getEnabled()).toBeFalsy();
    });

    it('control event (ui5 button)', async () => {
        const button = await browser.asControl(buttonSelector);
        await button.firePress();
    });

    it('ui5 getProperty and get$shortHand both work (example: list control)', async () => {
        const list = await browser.asControl(listSelector);
        const headerTextByShorthand = await list.getHeaderText();
        const headerTextByProperty = await list.getProperty('headerText');
        expect(headerTextByShorthand).toEqual('...bites the dust!');
        expect(headerTextByProperty).toEqual('...bites the dust!');
        expect(headerTextByShorthand).toBe(headerTextByProperty);
    });

    it('control id retrieval ', async () => {
        const list = await browser.asControl(listSelector);
        const listId = await list.getId();
        expect(listId).toContain('PeopleList');
    });

    it('ui5 list methods', async () => {
        const list = await browser.asControl(listSelector);

        const listMode = await list.getMode();
        const activeItem = await list.getActiveItem();
        const isBusy = await list.getBusy();
        // TODO: implement getModel properly? or not at all?
        // const model = await list.getModel();
        // TODO: make getBinding return some proper value? or don't proxy at all?
        const binding = await list.getBinding('items');

        expect(listMode).toEqual('None');
        expect(activeItem).toBeFalsy();
        expect(isBusy).toBeFalsy();
        // expect(model).toBeDefined(); // see above
        expect(binding).toBeDefined();
    });
});
