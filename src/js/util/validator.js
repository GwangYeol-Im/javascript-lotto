import { INVALID_PURCHASE_AMOUNT, UNIT_AMOUNT } from '../constants/index.js';

const validator = {
  purchaseAmountInput: money => {
    if (!(money / UNIT_AMOUNT > 0 && money % UNIT_AMOUNT === 0)) {
      return INVALID_PURCHASE_AMOUNT;
    }

    return '';
  },
};

export default validator;