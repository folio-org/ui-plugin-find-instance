import {
  clickable,
  collection,
  fillable,
  interactor,
  is,
  isPresent,
  property,
  scoped,
} from '@bigtest/interactor';

import ButtonInteractor from './ButtonInteractor';

@interactor class OrderLinesFilterInteractor {
  static defaultScope = '#uiPluginFindInstance--paneset';

  searchInput = fillable('[data-test-plugin-search-input]');
  searchButton = new ButtonInteractor('[data-test-plugin-search-submit]');
}

@interactor class PluginModalInteractor {
  static defaultScope = '[data-test-find-records-modal]';

  instances = collection('[role=rowgroup] [role=row]', {
    click: clickable(),
    selectLine: clickable('input[type="checkbox"]'),
  });

  save = scoped('[data-test-find-records-modal-save]', {
    click: clickable(),
    isDisabled: property('disabled'),
  });

  selectAll = scoped('[data-test-find-records-modal-select-all]', {
    click: clickable(),
  });

  closeModal = clickable('[data-test-find-records-modal-close]')
}

@interactor class PluginFindInstanceInteractor {
  button = scoped('[data-test-plugin-find-record-button]', {
    click: clickable(),
    isFocused: is(':focus'),
  });

  buttonIsLoaded = isPresent('[data-test-plugin-find-record-button]');

  whenLoaded() {
    return this.when(() => this.buttonIsLoaded, 5000);
  }

  modal = new PluginModalInteractor();
  filter = new OrderLinesFilterInteractor();
}

export default PluginFindInstanceInteractor;
