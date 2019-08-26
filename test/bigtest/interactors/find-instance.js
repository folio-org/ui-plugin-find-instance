import {
  interactor,
  scoped,
  collection,
  clickable,
  focusable,
  fillable,
  blurrable,
  is,
  isPresent,
  text,
} from '@bigtest/interactor';

import css from '../../../src/InstanceSearch.css';

@interactor class SearchField {
  static defaultScope = '[data-test-instance-search-input]';
  isFocused = is(':focus');
  focus = focusable();
  fill = fillable();
  blur = blurrable();
  value = text();
}

@interactor class PluginModalInteractor {
  clickInactiveUsersCheckbox = clickable('#clickable-filter-active-inactive');
  clickFacultyCheckbox = clickable('#clickable-filter-pg-faculty');
  clickGraduateCheckbox = clickable('#clickable-filter-pg-graduate');
  clickStaffCheckbox = clickable('#clickable-filter-pg-staff');
  clickUndergradCheckbox = clickable('#clickable-filter-pg-undergrad');

  instances = collection('[role="row"]', {
    click: clickable()
  });

  resetButton = scoped('#clickable-reset-all', {
    isEnabled: is(':not([disabled])'),
    click: clickable()
  });

  filterCheckboxes = collection('input [type="checkbox"]', {
    isChecked: is(':checked'),
  });

  searchField = scoped('[data-test-instance-search-input]', SearchField);
  searchFocused = is('[data-test-instance-search-input]', ':focus');
  searchButton = scoped('[data-test-instance-search-submit]', {
    click: clickable(),
    isEnabled: is(':not([disabled])'),
  });

  noResultsDisplayed = isPresent('[data-test-find-instance-no-results-message]');
}

@interactor class FindInstanceInteractor {
  button = scoped('[data-test-plugin-find-instance-button]', {
    click: clickable(),
    isFocused: is(':focus'),
  });

  modal = new PluginModalInteractor(`.${css.modalContent}`);
}

export default FindInstanceInteractor;
