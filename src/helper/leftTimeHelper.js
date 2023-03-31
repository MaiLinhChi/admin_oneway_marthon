import { TIME } from 'src/common/constants';

export const leftTime = ({ requestStartBlock, waitingBlock, latestBlock }) => {
  const expectedBlock = Number.parseInt(requestStartBlock) +  Number.parseInt(waitingBlock);
  const leftBlock = expectedBlock - Number.parseInt(latestBlock);
  const leftTime = leftBlock * TIME.TOMO_BLOCK_MINED_SECONDS * 1000;
  return leftTime;
}
