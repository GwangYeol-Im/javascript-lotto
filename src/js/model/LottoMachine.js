import { getRandomNumber } from '../util/index.js';
import {
  UNIT_AMOUNT,
  MIN_LOTTO_NUMBER,
  MAX_LOTTO_NUMBER,
  LOTTO_NUMBER_COUNT,
  WINNING_NUMBER_COUNT,
  PRIZE_MONEY,
} from '../constants/index.js';
import { Lotto } from './Lotto.js';

export class LottoMachine {
  #lottos = [];
  #insertedMoney = 0;
  #remains = 0;

  get lottos() {
    return [...this.#lottos];
  }

  get remains() {
    return this.#remains;
  }

  insert(money) {
    this.#insertedMoney = money;
    this.#remains = money;
  }

  publishLottoByManual(numbers) {
    if (!this.#remains) {
      return false;
    }
    this.#lottos.push(new Lotto(numbers));
    this.#remains -= UNIT_AMOUNT;

    return true;
  }

  publishLottosByAuto() {
    if (!this.#remains) {
      return false;
    }
    const count = this.#remains / UNIT_AMOUNT;

    for (let i = 0; i < count; i++) {
      const numbers = this.getRandomLottoNumbers();

      this.#lottos.push(new Lotto(numbers));
    }
    this.#remains = 0;

    return true;
  }

  getRandomLottoNumbers() {
    const numbers = [];

    while (numbers.length < LOTTO_NUMBER_COUNT) {
      const randomNumber = getRandomNumber(MIN_LOTTO_NUMBER, MAX_LOTTO_NUMBER);

      !numbers.includes(randomNumber) && numbers.push(randomNumber);
    }

    return numbers;
  }

  getWinningStatistics(winningNumbers) {
    const rankCounts = this.getRankCounts([...winningNumbers]);
    const earningRate = this.calculateEarningRate(rankCounts);

    return {
      rankCounts,
      earningRate,
    };
  }

  getRankCounts(winningNumbers) {
    const rankCounts = [0, 0, 0, 0, 0, 0]; // 등수와 인덱스 번호 일치 ex) 1등의 인덱스는 1
    const bonusNumber = winningNumbers.pop();
    const mainNumbers = winningNumbers;

    this.#lottos.forEach(lotto => {
      const rank = this.getRank(lotto, mainNumbers, bonusNumber);

      PRIZE_MONEY[rank] && rankCounts[rank]++;
    });

    return rankCounts;
  }

  getRank(lotto, mainNumbers, bonusNumber) {
    let matchCount = 0;
    let matchBonus = false;

    lotto.numbers.forEach(number => {
      if (bonusNumber === number) {
        matchBonus = true;

        return;
      }

      mainNumbers.includes(number) && matchCount++;
    });

    return matchCount === 6 || (matchCount === 5 && matchBonus === true)
      ? WINNING_NUMBER_COUNT - matchCount
      : WINNING_NUMBER_COUNT - matchCount + 1;
  }

  calculateEarningRate(rankCounts) {
    const earningRate = (this.calculateEarning(rankCounts) / this.#insertedMoney) * 100;

    return Number.isInteger(earningRate) ? earningRate : earningRate.toFixed(2);
  }

  calculateEarning(rankCounts) {
    return rankCounts.reduce((earning, count, rank) => {
      if (rank === 0) {
        return earning;
      }

      return (earning += PRIZE_MONEY[rank] * count);
    }, -this.#insertedMoney); // 수익 = 당첨금 - 투입금
  }

  reset() {
    this.#lottos = [];
    this.#insertedMoney = 0;
  }
}
