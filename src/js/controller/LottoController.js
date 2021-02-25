import {
  LOTTO_NUMBER_COUNT,
  MAX_LOTTO_NUMBER,
  MSG_SPENT_ALL_MONEY,
  WINNING_NUMBER_COUNT,
} from '../constants/index.js';
import { $, validator } from '../util/index.js';

export class LottoController {
  $purchaseAmountForm = $('#purchase-amount-form');
  $purchaseAmountInput = $('#purchase-amount-input');
  $purchaseAmountSubmit = $('#purchase-amount-submit');
  $manualPurchasingForm = $('#manual-purchasing-form');
  $autoPurchasingButton = $('#auto-purchasing-button');
  $lottoNumberInputs = $('[data-lotto-number]');
  $lottoToggle = $('#lotto-numbers-toggle-button');
  $resultForm = $('#lotto-result-form');
  $winningNumberInputs = $('[data-winning-number]');
  $modal = $('#modal');
  $modalClose = $('#modal-close');
  $resetButton = $('#reset-button');

  constructor(model, view) {
    this.machine = model;
    this.view = view;
  }

  initEvent() {
    this.$purchaseAmountForm.setEvent('submit', this.handlePurchaseAmountInput.bind(this));
    this.$manualPurchasingForm.setEvent('submit', this.handleManualPurchasing.bind(this));
    this.$autoPurchasingButton.setEvent('click', this.handleAutoPurchasing.bind(this));
    this.$lottoToggle.setEvent('click', this.handleLottoToggle.bind(this));
    this.$resultForm.setEvent('submit', this.handleResult.bind(this));
    this.$winningNumberInputs.setEvent('input', this.limitInputLength.bind(this));
    this.$modalClose.setEvent('click', () => this.$modal.removeClass('open'));
    this.$resetButton.setEvent('click', this.reset.bind(this));
  }

  handlePurchaseAmountInput(event) {
    event.preventDefault();
    const money = Number(this.$purchaseAmountInput.getValue());
    const alertMessage = validator.purchaseAmount(money);

    if (alertMessage) {
      alert(alertMessage);

      return;
    }

    this.machine.insert(money);
    this.$purchaseAmountInput.disable();
    this.$purchaseAmountSubmit.disable();
    this.view.renderPurchasingSection(money);
  }

  handleManualPurchasing(event) {
    event.preventDefault();
    const numbers = this.getNumbers(this.$lottoNumberInputs);
    const alertMessage = validator.lottoNumbers(numbers, LOTTO_NUMBER_COUNT);

    if (alertMessage) {
      alert(alertMessage);

      return;
    }
    if (!this.machine.publishLottoByManual(numbers)) {
      alert(MSG_SPENT_ALL_MONEY);

      return;
    }

    this.$lottoNumberInputs.setValue('');
    this.view.renderLottoSection(this.machine.lottos, this.machine.remains);
    this.machine.remains === 0 && this.view.renderResultForm();
  }

  getNumbers($inputs) {
    return $inputs //
      .filter($input => $input.value !== '')
      .map($input => Number($input.value));
  }

  handleAutoPurchasing() {
    if (!this.machine.publishLottosByAuto()) {
      alert(MSG_SPENT_ALL_MONEY);

      return;
    }

    this.view.renderLottoSection(this.machine.lottos, this.machine.remains);
    this.view.renderResultForm();
  }

  handleLottoToggle() {
    const $lottoContainer = $('#lotto-container');
    const $lottoNumbers = $('[data-lotto-numbers]');

    $lottoContainer.toggleClass('flex-col'); // toggle()을 이용해 flex direction 변경.
    this.$lottoToggle.isCheckedInput() //
      ? $lottoNumbers.show()
      : $lottoNumbers.hide();
  }

  limitInputLength({ target, target: { value } }) {
    const maxLength = String(MAX_LOTTO_NUMBER).length;

    if (value.length > maxLength) {
      target.value = value.slice(0, maxLength);
    }
  }

  handleResult(event) {
    event.preventDefault();
    const numbers = this.getNumbers(this.$winningNumberInputs);
    const alertMessage = validator.lottoNumbers(numbers, WINNING_NUMBER_COUNT);

    if (alertMessage) {
      alert(alertMessage);

      return;
    }

    this.view.renderWinningResult(this.machine.getWinningStatistics(numbers));
    this.$modal.addClass('open');
  }

  reset() {
    this.$modal.removeClass('open');
    this.$purchaseAmountInput.enable();
    this.$purchaseAmountSubmit.enable();
    this.$purchaseAmountInput.setValue('');
    this.$winningNumberInputs.setValue('');
    this.machine.reset();
    this.view.reset();
  }
}
