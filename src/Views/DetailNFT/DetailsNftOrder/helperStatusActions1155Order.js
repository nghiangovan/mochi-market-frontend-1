import { message } from 'antd';
import { getSellOrderBySellId } from 'APIs/SellOrder/Gets';
import { getAvailableToken1155OfOwner } from 'utils/helper';

export default async function helperStatusActions1155Order(
  walletAddress,
  chainId,
  sellID,
  addressToken,
  id,
  setStatus,
  setOrderDetail,
  history,
  setOwnersOnSale,
  setAvailable
) {
  if (!!chainId && !!sellID) {
    try {
      const sellOrder = await getSellOrderBySellId(chainId, sellID);
      if (!!sellOrder.isActive) {
        if (!!walletAddress) {
          if (sellOrder.seller.toLowerCase() === walletAddress.toLowerCase()) {
            setStatus(3);
          } else {
            setStatus(1);
          }
          let availableToken = await getAvailableToken1155OfOwner(
            walletAddress,
            addressToken,
            id,
            chainId
          );
          setAvailable(availableToken.balance);
        } else {
          setStatus(1);
        }
        if (!!sellOrder) {
          setOrderDetail({ ...sellOrder, tokenPayment: sellOrder.token });
          let listSeller = !!sellOrder.otherSellOrders ? sellOrder.otherSellOrders : [];
          listSeller.unshift(sellOrder);
          setOwnersOnSale(listSeller);
        }
      } else {
        return history.push('/404');
      }
    } catch (error) {
      console.log(error);
      message.error("Sell order doesn't exist!");
      return history.push('/404');
    }
  }
}
