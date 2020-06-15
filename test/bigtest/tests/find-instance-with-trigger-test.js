import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/helpers';
import PluginFindInstanceInteractor from '../interactors/PluginFindInstanceInteractor';

const INSTANCES_COUNT = 15;

describe('Find instance plugin with single select option', function () {
  const findInstance = new PluginFindInstanceInteractor();

  setupApplication();

  beforeEach(async function () {
    this.server.createList('instance', INSTANCES_COUNT);
  });

  describe('Find instance button', () => {
    it('should be rendered', function () {
      expect(findInstance.button.isPresent).to.be.true;
    });

    describe('click action', function () {
      beforeEach(async function () {
        await findInstance.button.click();
      });

      it('should open a modal', function () {
        expect(findInstance.modal.isPresent).to.be.true;
      });
    });
  });

  describe('modal list', function () {
    beforeEach(async function () {
      await findInstance.button.click();
      await findInstance.filter.searchInput('TEST');
      await findInstance.filter.searchButton.click();
    });

    it('should return a set of results', function () {
      expect(findInstance.modal.instances().length).to.be.equal(INSTANCES_COUNT);
    });

    describe('select an instance (click on it)', function () {
      beforeEach(async function () {
        await findInstance.modal.instances(1).click();
      });

      it('modal is closed', function () {
        expect(findInstance.modal.isPresent).to.be.false;
      });
    });
  });
});
