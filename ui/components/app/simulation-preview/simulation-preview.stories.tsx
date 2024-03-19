import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import configureStore from '../../../store/store';
import { SimulationPreview } from './simulation-preview';
import mockState from '../../../../test/data/mock-state.json';
import { SimulationTokenStandard } from '@metamask/transaction-controller';
import { Hex } from '@metamask/utils';

const DUMMY_BALANCE_CHANGE = {
  previousBalance: '0xIGNORED' as Hex,
  newBalance: '0xIGNORED' as Hex,
}

const CHAIN_ID_MOCK = '0x1';
const ERC20_TOKEN_1_MOCK = '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'; // WBTC
const ERC20_TOKEN_2_MOCK = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'; // USDC
const ERC721_TOKEN_MOCK = '0x06012c8cf97bead5deae237070f9587f8e7a266d'; // CryptoKitties
const ERC1155_TOKEN_MOCK = '0x60E4d786628Fea6478F785A6d7e704777c86a7c6'; // MAYC

const storeMock = configureStore({
  metamask: {
    ...mockState.metamask,
    preferences: {
      ...mockState.metamask.preferences,
      useNativeCurrencyAsPrimaryCurrency: false,
    },
    providerConfig: {
      ...mockState.metamask.providerConfig,
      chainId: CHAIN_ID_MOCK,
    },
    useTokenDetection: true,
    tokenList: {
      [ERC20_TOKEN_1_MOCK]: {
        address: ERC20_TOKEN_1_MOCK,
        symbol: 'WBTC',
        name: 'Wrapped Bitcoin',
        iconUrl:
          `https://static.metafi.codefi.network/api/v1/tokenIcons/1/${ERC20_TOKEN_1_MOCK}.png`,
      },
      [ERC20_TOKEN_2_MOCK]: {
        address: ERC20_TOKEN_2_MOCK,
        symbol: 'USDC',
        name: 'USD Coin',
        iconUrl:
          `https://static.metafi.codefi.network/api/v1/tokenIcons/1/${ERC20_TOKEN_2_MOCK}.png`,
      },
      [ERC721_TOKEN_MOCK]: {
        address: ERC721_TOKEN_MOCK,
        symbol: 'CK',
        name: 'CryptoKitties',
        iconUrl:
          `https://static.metafi.codefi.network/api/v1/tokenIcons/1/${ERC721_TOKEN_MOCK}.png`,
      },
      [ERC1155_TOKEN_MOCK]: {
        address: ERC1155_TOKEN_MOCK,
        symbol: 'MAYC',
        name: 'Mutant Ape Yacht Club',
        iconUrl:
          `https://static.metafi.codefi.network/api/v1/tokenIcons/1/${ERC1155_TOKEN_MOCK}.png `
      }
    },
  },
});

const meta: Meta<typeof SimulationPreview> = {
  title: 'Components/App/SimulationPreview',
  component: SimulationPreview,
  decorators: [(story) => <Provider store={storeMock}>{story()}</Provider>],
};

export default meta;
type Story = StoryObj<typeof SimulationPreview>;

export const BuyErc20: Story = {
  args: {
    simulationData: {
      nativeBalanceChange: {
        ...DUMMY_BALANCE_CHANGE,
        difference: '0x12345678912345678',
        isDecrease: true,
      },
      tokenBalanceChanges: [{
        ...DUMMY_BALANCE_CHANGE,
        address: ERC20_TOKEN_1_MOCK,
        difference: '0x123456',
        isDecrease: false,
        standard: SimulationTokenStandard.erc20,
      }, {
        ...DUMMY_BALANCE_CHANGE,
        address: ERC20_TOKEN_2_MOCK,
        difference: '0x123456901',
        isDecrease: false,
        standard: SimulationTokenStandard.erc20,
      }, {
        ...DUMMY_BALANCE_CHANGE,
        address: ERC721_TOKEN_MOCK,
        difference: '0x1',
        isDecrease: false,
        id: '0x721',
        standard: SimulationTokenStandard.erc721,
      }, {
        ...DUMMY_BALANCE_CHANGE,
        address: ERC1155_TOKEN_MOCK,
        difference: '0x13',
        isDecrease: false,
        id: '0x1155',
        standard: SimulationTokenStandard.erc1155,
      }],
    },
  },
};


export const PositiveNativeChange: Story = {
  args: {
    simulationData: {
      nativeBalanceChange: {
        previousBalance: '0x2',
        newBalance: '0x1',
        difference: '0x12345678912345678',
        isDecrease: false,
      },
      tokenBalanceChanges: [],
    },
  },
};

export const NegativeNativeChange: Story = {
  args: {
    simulationData: {
      nativeBalanceChange: {
        previousBalance: '0x1',
        newBalance: '0x2',
        difference: '0x12345678912345678',
        isDecrease: true,
      },
      tokenBalanceChanges: [],
    },
  },
};

export const NoBalanceChanges: Story = {
  args: {
    simulationData: {
      nativeBalanceChange: undefined,
      tokenBalanceChanges: [],
    },
  },
};

export const SimulationFailed: Story = {
  args: {},
}
