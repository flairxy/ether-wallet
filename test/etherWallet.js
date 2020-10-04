const EtherWallet = artifacts.require("EtherWallet");

contract("EtherWallet", (accounts) => {
  let etherWallet = null;
  before(async () => {
    etherWallet = await EtherWallet.deployed();
  });

  it("should set account[0] as owner", async () => {
    const owner = await etherWallet.owner();
    assert(owner === accounts[0]);
  });

  it("should deposit ether to etherWallet", async () => {
    await etherWallet.deposit({ from: accounts[0], value: 100 });
    const balance = await web3.eth.getBalance(etherWallet.address);
    assert(parseInt(balance) === 100);
  });

  it("should return the balance of the contract", async () => {
    const balance = await etherWallet.balanceOf();
    assert(parseInt(balance) === 100);
  });

  it("should transfer ether to another address", async () => {
    const balanceRecipientBefore = await web3.eth.getBalance(accounts[1]);
    await etherWallet.send(accounts[1], 50, { from: accounts[0] });
    const walletBalance = await web3.eth.getBalance(etherWallet.address);
    assert(parseInt(walletBalance) === 50);
    const balanceRecipientAfter = await web3.eth.getBalance(accounts[1]);
    const finalBalance = await web3.utils.toBN(balanceRecipientAfter);
    const initialBalance = await web3.utils.toBN(balanceRecipientBefore);
    assert(finalBalance.sub(initialBalance).toNumber() === 50);
  });

  it("should NOT transfer ether if tx is not from owner", async () => {
    try {
      await etherWallet.send(accounts[1], 50, { from: accounts[2] });
    } catch (e) {
      assert(e.message.includes("sender is not allowed"));
      return;
    }
    assert(false);
  });
});
