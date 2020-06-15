import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/helpers';
import PluginFindInstanceInteractor from '../interactors/PluginFindInstanceInteractor';

const INSTANCES_COUNT = 15;

describe('Find instance plugin with multiselect', function () {
  const findInstance = new PluginFindInstanceInteractor();

  setupApplication({
    isMultiSelect: true,
  });

  beforeEach(async function () {
    this.server.createList('instance', INSTANCES_COUNT);
  });

  describe('Find instance button', () => {
    it('should open a modal', function () {
      expect(findInstance.modal.isPresent).to.be.true;
    });
  });

  describe('modal list', function () {
    beforeEach(async function () {
      await findInstance.filter.searchInput('TEST');
      await findInstance.filter.searchButton.click();
    });

    it('should return a set of results', function () {
      expect(findInstance.modal.instances().length).to.be.equal(INSTANCES_COUNT);
    });

    it('should display disabled save button', function () {
      expect(findInstance.modal.save.isDisabled).to.be.true;
    });

    describe('select an instance', function () {
      beforeEach(async function () {
        await findInstance.modal.instances(1).selectLine();
      });

      it('should enable Save button', function () {
        expect(findInstance.modal.save.isDisabled).to.be.false;
      });
    });

    describe('select all', function () {
      beforeEach(async function () {
        await findInstance.modal.selectAll.click();
      });

      it('should enable Save button', function () {
        expect(findInstance.modal.save.isDisabled).to.be.false;
      });
    });
  });

  describe('close plugin', function () {
    beforeEach(async function () {
      await findInstance.modal.closeModal();
    });

    it('should close modal', function () {
      expect(findInstance.modal.isPresent).to.be.false;
    });
  });
});
