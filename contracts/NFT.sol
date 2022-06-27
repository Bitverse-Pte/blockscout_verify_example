//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * Mint a single ERC721 which can hold NFTs
 */
contract NFTVaultETH is AccessControl, Ownable, IERC721Receiver {
    using Address for address;
    using SafeMath for *;

    bytes32 public constant USER_ROLE = keccak256("USER_ROLE");
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    address public pay_coin;
    address public base_nft;
    uint256 public pay_amount;

    uint256 MARKET_START_TIMESTAMP;
    uint256 MARKET_END_TIMESTAMP;
    uint256 WHITELIST_START_TIMESTAMP;
    uint256 WHITELIST_END_TIMESTAMP;
    uint256 WLAmount;

    uint256 WL_LIMIT;


    uint256 supply;
    uint256 sell_amount;
    bool white_list_status;
    uint256 [] token_id_queue;


    event BatchDepositeNTF(address _token, uint256[] _tokenIds);
    event BuyNFT(address account, uint256 tokenId);
    event RegisterWhiteList(address account);


    constructor(address _coin,
        uint256 _amount,
        address nft_address
    ) {
        _setPayCoin(_coin);
        _setBaseNFT(nft_address);
        _setPayAmount(_amount);
        _setupRole(MANAGER_ROLE, owner());

    }


    /// -----------------------------------
    /// ----------- BASIC SETTER ----------
    /// -----------------------------------

    function _setPayCoin(address _coin) internal {
        pay_coin = _coin;
    }

    function _setBaseNFT(address _nft) internal {
        base_nft = _nft;
    }

    function setBaseNFT(address _nft) external
    onlyOwner
    returns (bool)
    {
        _setBaseNFT(_nft);
        return true;

    }

    function setPayAmount(uint256 _amount) external
    onlyOwner
    returns (bool)
    {
        _setPayAmount(_amount);
        return true;
    }

    function _setPayAmount(uint256 _amount) internal
    {
        pay_amount = _amount;
    }


    function _setMarketStartTimestamp(uint256 startTimestamp) external onlyOwner
    returns (bool)
    {
        MARKET_START_TIMESTAMP = startTimestamp;
        return true;
    }

    function _setMarketEndTimestamp(uint256 endTimestamp) external onlyOwner
    returns (bool)
    {
        MARKET_END_TIMESTAMP = endTimestamp;
        return true;
    }

    function _setWLStartTimestamp(uint256 startTimestamp) external onlyOwner
    returns (bool){
        WHITELIST_START_TIMESTAMP = startTimestamp;
        return true;
    }

    function _setWLEndTimestamp(uint256 endTimestamp) external onlyOwner
    returns (bool)
    {
        WHITELIST_END_TIMESTAMP = endTimestamp;
        return true;
    }


    function setInitTs(
        uint256 wl_ts_start,
        uint256 wl_ts_end,
        uint256 market_ts_start,
        uint256 market_ts_end
    )
    external
    onlyOwner
    returns (bool)
    {
        WHITELIST_END_TIMESTAMP = wl_ts_end;
        WHITELIST_START_TIMESTAMP = wl_ts_start;
        MARKET_END_TIMESTAMP = market_ts_end;
        MARKET_START_TIMESTAMP = market_ts_start;
        return true;

    }


    function setWLLimit(
        uint256 limit_amount
    )
    external
    onlyOwner
    returns (bool)
    {
        WL_LIMIT = limit_amount;
        return true;
    }

    /// -----------------------------------
    /// ----------- BASIC GETTER ----------
    /// -----------------------------------

    function WLEndTs() external view returns (uint256) {
        return WHITELIST_END_TIMESTAMP;
    }

    function WLStartTs() external view returns (uint256) {
        return WHITELIST_START_TIMESTAMP;
    }

    function MarketEndTs() external view returns (uint256) {
        return MARKET_END_TIMESTAMP;
    }

    function MarketStartTs() external view returns (uint256) {
        return MARKET_START_TIMESTAMP;
    }

    function payAmount() external view returns (uint256) {
        return pay_amount;
    }

    function payCoin() external view returns (address){
        return pay_coin;
    }

    function baseNFT() external view returns (address){
        return base_nft;
    }

    function checkWhiteList(address account) public view returns (bool rst){
        require(account != address(0), "address cant be zero");
        return hasRole(USER_ROLE, account);
    }

    function checkWhiteListOpenStatus() external view onlyWhiteListOpen returns (bool){
        return true;
    }

    function checkMarketOpenStatus() external view onlyMarketOpen returns (bool){
        return true;
    }

    function getWLAmount() external view onlyRole(MANAGER_ROLE) returns (uint256){
        return WLAmount;
    }

    function getWLLimit()
    external view returns (uint256){
        return WL_LIMIT;
    }

    /// -----------------------------------
    /// --------- BASIC USER ACTION -------
    /// -----------------------------------
    function batchApproveForNFT(uint256 [] calldata tokenIds) onlyRole(MANAGER_ROLE) external {
        require(base_nft != address(0), "nft contract address cant be zero");
        for (uint256 i = 0; i < tokenIds.length; i++) {
            IERC721(base_nft).approve(address(this), tokenIds[i]);
        }
    }

    function depositeNFT(address _token, uint256 _tokenId) public onlyRole(MANAGER_ROLE) {
        require(_token == base_nft, "must deposite nft with  right type ");
        IERC721(_token).safeTransferFrom(msg.sender, address(this), _tokenId);
        token_id_queue.push(_tokenId);
        supply++;
    }


    function batchDepositeNFT(address _token, uint256[] calldata _tokenIds) public onlyRole(MANAGER_ROLE) {
        require(_token == base_nft, "must deposite nft with right type ");
        uint256 length = _tokenIds.length;
        uint256 tid;
        for (uint256 i = 0; i < length; i++) {
            tid = _tokenIds[i];
            IERC721(_token).safeTransferFrom(msg.sender, address(this), tid);
            token_id_queue.push(tid);
            supply++;

        }
        emit BatchDepositeNTF(_token, _tokenIds);

    }

    function gen_random() internal view returns (uint256){
        return uint256(keccak256(abi.encodePacked(block.timestamp, gasleft())));
    }

    function buyOne(address account) internal onlyMarketOpen returns (uint256){

        require(msg.value >= pay_amount, "account balance not enough");
        uint256 length = token_id_queue.length;
        uint256 random = gen_random();
        uint256 i = random % length;
        uint256 temp = token_id_queue[length - 1];
        token_id_queue[length - 1] = token_id_queue[i];
        token_id_queue[i] = temp;
        uint256 tid = token_id_queue[length - 1];
        IERC721(base_nft).safeTransferFrom(address(this), account, tid);
        token_id_queue.pop();
        sell_amount++;
        emit BuyNFT(account, tid);
        return tid;
    }

    function buyNFTs(address account, uint256 amount) external payable onlyRole(USER_ROLE) onlyMarketOpen

    {
        require(msg.value >= pay_amount * amount, "account balance not enough");
        require(amount != 0, "buy amount must not be zero");
        require(IERC721(base_nft).balanceOf(account) + amount < 4, "buy amount must lower than 4 per account");
        require(token_id_queue.length >= amount, "exceed the left amount");
        for (uint256 i = 0; i < amount; i++) {
            buyOne(account);
        }

    }

    function registerWhiteList() onlyWhiteListOpen public {
        require(!hasRole(USER_ROLE, address(msg.sender)),
            "already register"
        );
        if (WL_LIMIT != 0) {
            require(WL_LIMIT >= WLAmount, "white list exceed");
        }
        _setupRole(USER_ROLE, address(msg.sender));
        WLAmount++;
        emit RegisterWhiteList(address(msg.sender));
    }

    function batchRegister(address[] calldata addresslist) public onlyRole(MANAGER_ROLE)
    returns (bool)
    {
        uint256 n = addresslist.length;
        WLAmount=WLAmount.add(n);
        for (uint256 i = 0; i < n; i++) {
            _setupRole(USER_ROLE, addresslist[i]);
        }
        return true;
    }

    function registerManager(address _manager) onlyOwner external {
        _setupRole(MANAGER_ROLE, _manager);
    }

    function withdraw(address account) external onlyOwner {
        payable(account).transfer(address(this).balance);
    }


    function onERC721Received(address, address, uint256, bytes calldata) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }


    function timestamp() view external returns (uint256){
        return block.timestamp;
    }

    function totalsupply() view external returns (uint256){
        return supply;
    }

    function sellAmount() view external returns (uint256){
        return supply-token_id_queue.length;
    }

    function nowSupply() view external returns (uint256){
        return token_id_queue.length;
    }


    modifier onlyWhiteListOpen(){
        require(WHITELIST_START_TIMESTAMP <= block.timestamp, "white list not open");
        require(WHITELIST_END_TIMESTAMP >= block.timestamp, "white list has closed");
        _;
    }
    modifier onlyMarketOpen(){
        require(MARKET_START_TIMESTAMP <= block.timestamp, "market state not open");
        require(MARKET_END_TIMESTAMP >= block.timestamp, "market state has closed");
        _;
    }

}




