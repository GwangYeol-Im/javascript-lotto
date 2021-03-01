import { Component } from '../../shared/models/index.js';
import { $$, $ } from '../../shared/utils/DOM.js';

export default class ResultModal extends Component {
  constructor($target, props) {
    super($target, props);
    this.props.state.subscribe(this.renderState.bind(this));
  }

  initDOM() {
    this.$ranks = $$('[data-rank]');
    this.$earningRate = $('#earning-rate');
    this.$closeButton = $('#modal-close');
    this.$resetButton = $('#reset-button');
  }

  initEvent() {
    this.$resetButton.addEventListener('click', this.props.reset);
    this.$closeButton.addEventListener('click', this.props.close);
  }

  mountTemplate() {
    this.$target.innerHTML = `
        <div class="modal-inner p-10">
          <div class="modal-close" id="modal-close">
            <svg viewbox="0 0 40 40">
              <path class="close-x" d="M 10,10 L 30,30 M 30,10 L 10,30" />
            </svg>
          </div>
          <h2 class="text-center">🏆 당첨 통계 🏆</h2>
          <div class="d-flex justify-center">
            <table class="result-table border-collapse border border-black">
              <thead>
                <tr class="text-center">
                  <th class="p-3">일치 갯수</th>
                  <th class="p-3">당첨금</th>
                  <th class="p-3">당첨 갯수</th>
                </tr>
              </thead>
              <tbody>
                <tr class="text-center">
                  <td class="p-3">3개</td>
                  <td class="p-3">5,000</td>
                  <td data-rank="5" class="p-3"></td>
                </tr>
                <tr class="text-center">
                  <td class="p-3">4개</td>
                  <td class="p-3">50,000</td>
                  <td data-rank="4" class="p-3"></td>
                </tr>
                <tr class="text-center">
                  <td class="p-3">5개</td>
                  <td class="p-3">1,500,000</td>
                  <td data-rank="3" class="p-3"></td>
                </tr>
                <tr class="text-center">
                  <td class="p-3">5개 + 보너스볼</td>
                  <td class="p-3">30,000,000</td>
                  <td data-rank="2" class="p-3"></td>
                </tr>
                <tr class="text-center">
                  <td class="p-3">6개</td>
                  <td class="p-3">2,000,000,000</td>
                  <td data-rank="1" class="p-3"></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="text-center font-bold">
            당신의 총 수익률은 <span id="earning-rate"></span>%입니다.
          </p>
          <div class="d-flex justify-center mt-5">
            <button type="button" class="btn btn-cyan" id="reset-button">다시 시작하기</button>
          </div>
        </div>
    `;
  }

  renderState() {
    const { rankCounts, earningRate } = this.props.state.getState();

    this.$earningRate.innerText = earningRate;
    this.$ranks.forEach($rank => {
      const { rank } = $rank.dataset;

      $rank.innerText = `${rankCounts[rank]} 개`;
    });
  }
}
