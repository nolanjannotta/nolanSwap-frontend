import { utils, constants } from "ethers";


export const isZeroAddress = (address) => {
    return address == constants.AddressZero;
}

export const isValidAddress = (address) => {
    return utils.isAddress(address)

}