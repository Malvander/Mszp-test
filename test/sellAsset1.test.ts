import { Mangata, TToken, TTokenId, BN } from "@mangata-finance/sdk";

test.skip('smoke test', async () => {
  const mangata = Mangata.getInstance(["wss://v4-collator-01.mangatafinance.cloud"]);
  const [chain, nodeName, nodeVersion] = await Promise.all([
    mangata.getChain(),
    mangata.getNodeName(),
    mangata.getNodeVersion()
  ]);

  console.log(
    `You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`
  );

  expect(nodeName).toBe("Mangata Parachain Collator");
});

test('test asset selling', async () => {
  const mangata = Mangata.getInstance(["wss://v4-collator-01.mangatafinance.cloud"]);
  const balance: Record<TTokenId, TToken> | null = await mangata.getOwnedTokens("5DeztabhWJCNQggjtKJGK5BqDV3kVR3okGjbWJ2VU6Ly3gDH");
  let mgaBalanceDec = 0;
  if (balance) {
    mgaBalanceDec = Number(balance[0].balance.free.toString(10));
    console.log(
      `Your MGA Balance: ${mgaBalanceDec}`
    );
  } else {
    fail('should retrieve balance successfully')
  }
  expect(mgaBalanceDec).toBeGreaterThan(0);
  //mangata.calculateSellPrice
  let sellAmount = new BN(0.0001);
  //figure out how to sign the transaction
  let sellAsset = await mangata.sellAsset("5DeztabhWJCNQggjtKJGK5BqDV3kVR3okGjbWJ2VU6Ly3gDH", "0", "4", sellAmount, sellAmount);
  expect(sellAsset).toEqual(0);

  //check outcome
});