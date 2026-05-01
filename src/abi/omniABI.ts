export default {
  abi: [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor"
    },
    {
      inputs: [],
      name: "AccessControlBadConfirmation",
      type: "error"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address"
        },
        {
          internalType: "bytes32",
          name: "neededRole",
          type: "bytes32"
        }
      ],
      name: "AccessControlUnauthorizedAccount",
      type: "error"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "target",
          type: "address"
        }
      ],
      name: "AddressEmptyCode",
      type: "error"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "implementation",
          type: "address"
        }
      ],
      name: "ERC1967InvalidImplementation",
      type: "error"
    },
    {
      inputs: [],
      name: "ERC1967NonPayable",
      type: "error"
    },
    {
      inputs: [],
      name: "FailedCall",
      type: "error"
    },
    {
      inputs: [],
      name: "InvalidInitialization",
      type: "error"
    },
    {
      inputs: [],
      name: "NotInitializing",
      type: "error"
    },
    {
      inputs: [],
      name: "UUPSUnauthorizedCallContext",
      type: "error"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "slot",
          type: "bytes32"
        }
      ],
      name: "UUPSUnsupportedProxiableUUID",
      type: "error"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "from",
          type: "address"
        },
        {
          indexed: false,
          internalType: "address",
          name: "inviter",
          type: "address"
        }
      ],
      name: "Bind",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "user",
          type: "address"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "pid",
          type: "uint256"
        }
      ],
      name: "Deposit",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint64",
          name: "version",
          type: "uint64"
        }
      ],
      name: "Initialized",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "user",
          type: "address"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "id",
          type: "uint256"
        }
      ],
      name: "Reward",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "role",
          type: "bytes32"
        },
        {
          indexed: true,
          internalType: "bytes32",
          name: "previousAdminRole",
          type: "bytes32"
        },
        {
          indexed: true,
          internalType: "bytes32",
          name: "newAdminRole",
          type: "bytes32"
        }
      ],
      name: "RoleAdminChanged",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "role",
          type: "bytes32"
        },
        {
          indexed: true,
          internalType: "address",
          name: "account",
          type: "address"
        },
        {
          indexed: true,
          internalType: "address",
          name: "sender",
          type: "address"
        }
      ],
      name: "RoleGranted",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "role",
          type: "bytes32"
        },
        {
          indexed: true,
          internalType: "address",
          name: "account",
          type: "address"
        },
        {
          indexed: true,
          internalType: "address",
          name: "sender",
          type: "address"
        }
      ],
      name: "RoleRevoked",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "implementation",
          type: "address"
        }
      ],
      name: "Upgraded",
      type: "event"
    },
    {
      inputs: [],
      name: "DEFAULT_ADMIN_ROLE",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "UPGRADER_ROLE",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "UPGRADE_INTERFACE_VERSION",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "UsdtToken",
      outputs: [
        {
          internalType: "contract IERC20",
          name: "",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_inviter",
          type: "address"
        }
      ],
      name: "bind",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "pid",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        }
      ],
      name: "deposit",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      name: "depositInfo",
      outputs: [
        {
          internalType: "uint256",
          name: "minAmount",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "joinUser",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32"
        }
      ],
      name: "getRoleAdmin",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32"
        },
        {
          internalType: "address",
          name: "account",
          type: "address"
        }
      ],
      name: "grantRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32"
        },
        {
          internalType: "address",
          name: "account",
          type: "address"
        }
      ],
      name: "hasRole",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "top",
          type: "address"
        }
      ],
      name: "initialize",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256[]",
          name: "ids",
          type: "uint256[]"
        },
        {
          internalType: "address[]",
          name: "users",
          type: "address[]"
        },
        {
          internalType: "uint256[]",
          name: "reward",
          type: "uint256[]"
        }
      ],
      name: "multiSend",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "operations",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "proxiableUUID",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32"
        },
        {
          internalType: "address",
          name: "callerConfirmation",
          type: "address"
        }
      ],
      name: "renounceRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32"
        },
        {
          internalType: "address",
          name: "account",
          type: "address"
        }
      ],
      name: "revokeRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "rewardPoolRatio",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      name: "sendReward",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_addr",
          type: "address"
        }
      ],
      name: "setAdmin",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes4",
          name: "interfaceId",
          type: "bytes4"
        }
      ],
      name: "supportsInterface",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "teamRatio",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "treasuryRatio",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newImplementation",
          type: "address"
        },
        {
          internalType: "bytes",
          name: "data",
          type: "bytes"
        }
      ],
      name: "upgradeToAndCall",
      outputs: [],
      stateMutability: "payable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address"
        }
      ],
      name: "userInfo",
      outputs: [
        {
          internalType: "address",
          name: "inviter",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "outAmount",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "maxAmount",
          type: "uint256"
        },
        {
          internalType: "bool",
          name: "join",
          type: "bool"
        }
      ],
      stateMutability: "view",
      type: "function"
    }
  ]
};
