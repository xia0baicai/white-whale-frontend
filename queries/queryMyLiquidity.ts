import { queryLiquidityBalance } from '../services/liquidity'
import { protectAgainstNaN } from '../util/conversion'
import { isNativeToken } from 'services/asset'

export async function queryMyLiquidity({ swap, address, context: { client } }) {
  const isNative = isNativeToken(swap.lp_token)
  const providedLiquidityInMicroDenom = address
    ? await queryLiquidityBalance({
        tokenAddress: swap.lp_token,
        client,
        address,
        isNative,
      })
    : 0

  /* provide dollar value for reserves as well */
  const totalReserve: [number, number] = [
    protectAgainstNaN(swap.token1_reserve),
    protectAgainstNaN(swap.token2_reserve),
  ]

  const providedReserve: [number, number] = [
    protectAgainstNaN(
      totalReserve[0] * (providedLiquidityInMicroDenom / swap.lp_token_supply)
    ),
    protectAgainstNaN(
      totalReserve[1] * (providedLiquidityInMicroDenom / swap.lp_token_supply)
    ),
  ]

  return {
    totalReserve,
    providedReserve,
    providedLiquidityInMicroDenom,
  }
}

export const lpToAssets = (swap, lockedLiquidityInMicroDenom) => {
  const totalReserve: [number, number] = [
    protectAgainstNaN(swap.token1_reserve),
    protectAgainstNaN(swap.token2_reserve),
  ]

  const providedReserve: [number, number] = [
    protectAgainstNaN(
      totalReserve[0] * (lockedLiquidityInMicroDenom / swap.lp_token_supply)
    ),
    protectAgainstNaN(
      totalReserve[1] * (lockedLiquidityInMicroDenom / swap.lp_token_supply)
    ),
  ]

  return {
    totalReserve,
    providedReserve,
    lockedLiquidityInMicroDenom,
  }
}
