import { Mangata, TToken, TTokenId, BN, MangataGenericEvent, toBN } from "@mangata-finance/sdk";
import { Keyring } from '@polkadot/api';

const keyring = new Keyring({ type: 'sr25519' });

/*
  This test checks if we are properly connecting
*/
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

/*
  This test checks if sell transaction is successful & if assets numbers has changed
*/
test('test asset selling', async () => {
  jest.setTimeout(20000);
  const mangata = Mangata.getInstance(["wss://v4-collator-01.mangatafinance.cloud"]);
  const balance: Record<TTokenId, TToken> | null = await mangata.getOwnedTokens("5DeztabhWJCNQggjtKJGK5BqDV3kVR3okGjbWJ2VU6Ly3gDH");
  let mgaBalanceDec = 0;
  let mksmBalanceDec = 0;
  if (balance) {
    mgaBalanceDec = Number(balance[0].balance.free.toString(10));
    mksmBalanceDec = Number(balance[4].balance.free.toString(10));
    console.log(
      `Your MGA Balance: ${mgaBalanceDec}`
    );
  } else {
    fail('should retrieve balance successfully')
  }
  expect(mgaBalanceDec).toBeGreaterThan(0);
  //TODO: mangata.calculateSellPrice
  let sellAmount = toBN("1", 15);
  //TODO: include calculated output
  let buyMinAmount = toBN("1", 5);

  const PHRASE = 'tilt hidden kingdom bomb twice fragile obtain tuition ridge raise danger delay';
  const newPair = keyring.addFromUri(PHRASE);
  let sellAsset: MangataGenericEvent[] = await mangata.sellAsset(newPair, "0", "4", sellAmount, buyMinAmount);
  console.log(sellAsset[0])
  //check outcome
  expect(sellAsset[0].method).toEqual('AssetsSwapped');
  expect(sellAsset[1].method).toEqual('ExtrinsicSuccess');
  //TODO: include fee, check detailed numbers
  const balanceAfterTransaction: Record<TTokenId, TToken> | null = await mangata.getOwnedTokens("5DeztabhWJCNQggjtKJGK5BqDV3kVR3okGjbWJ2VU6Ly3gDH");
  if (balanceAfterTransaction) {
    let mgaCurrentBalanceDec = Number(balance[0].balance.free.toString(10));
    let mksmCurrentBalanceDec = Number(balance[4].balance.free.toString(10));
    expect(mgaCurrentBalanceDec).toBeLessThan(mgaBalanceDec)
    expect(mksmCurrentBalanceDec).toBeGreaterThan(mksmBalanceDec)
  } else {
    fail('should retrieve current balance successfully')
  }

});