import React, { useState, useEffect } from 'react';
import './App.css'; // Import the main App styles
import './index.css'; // Import global styles

/**
 * @typedef {Object} LotteryState
 * @property {boolean} active - Indicates if a lottery is currently active.
 * @property {number} ticketPrice - The price of one lottery ticket.
 * @property {string[]} participants - List of mock user addresses who bought tickets.
 * @property {string | null} winner - The address of the lottery winner, or null if not drawn.
 */

// Initial state for our mock lottery system
const initialLotteryState = {
  active: false,
  ticketPrice: 0,
  participants: [],
  winner: null,
};

function App() {
  // State for the entire lottery system
  const [lottery, setLottery] = useState(initialLotteryState);
  // State for the input field when creating a new lottery
  const [newLotteryTicketPrice, setNewLotteryTicketPrice] = useState('');
  // Mock user address (no actual wallet connection in this version)
  const [mockUserAddress, setMockUserAddress] = useState('0xMockUserAddress123');

  // Simulate loading initial lottery data (e.g., from local storage or a mock API)
  useEffect(() => {
    // In a real app, you'd fetch initial data from a backend here.
    // For this example, we're just setting a default state or could load from localStorage.
    console.log("App component mounted. Initializing mock lottery state.");
  }, []);

  /**
   * Handles the creation of a new lottery.
   * This function simulates a backend call by updating local state.
   */
  const handleCreateLottery = () => {
    const price = parseFloat(newLotteryTicketPrice);
    if (isNaN(price) || price <= 0) {
      alert("Please enter a valid ticket price greater than 0.");
      return;
    }

    if (lottery.active) {
      alert("An active lottery already exists. Please pick a winner first.");
      return;
    }

    setLottery({
      active: true,
      ticketPrice: price,
      participants: [],
      winner: null,
    });
    setNewLotteryTicketPrice(''); // Clear the input field
    alert(`🎉 New lottery created with ticket price: ${price} APT!`);
  };

  /**
   * Handles the purchase of a ticket for the active lottery.
   * This simulates adding the current user to the participants list.
   */
  const handleBuyTicket = () => {
    if (!lottery.active) {
      alert("🚫 No active lottery to join. Please create one first!");
      return;
    }

    // Check if the user has already bought a ticket (optional, depends on lottery rules)
    if (lottery.participants.includes(mockUserAddress)) {
      alert("You have already purchased a ticket for this lottery.");
      return;
    }
    
    // Simulate buying a ticket by adding the mock user to the participants list
    setLottery(prevLottery => ({
      ...prevLottery,
      participants: [...prevLottery.participants, mockUserAddress]
    }));

    alert(`🎫 Ticket purchased successfully by ${mockUserAddress}!`);
  };

  /**
   * Selects a random winner from the current participants.
   * Ends the current lottery.
   */
  const handlePickWinner = () => {
    if (!lottery.active) {
      alert("The lottery is not active.");
      return;
    }
    if (lottery.participants.length === 0) {
      alert("No participants to pick a winner from. 😔");
      return;
    }

    const randomIndex = Math.floor(Math.random() * lottery.participants.length);
    const selectedWinner = lottery.participants[randomIndex];

    setLottery(prevLottery => ({
      ...prevLottery,
      winner: selectedWinner,
      active: false, // End the lottery
    }));

    alert(`🏆 Congratulations! The winner is: ${selectedWinner}`);
  };

  // Calculate the current prize pool
  const prizePool = lottery.participants.length * lottery.ticketPrice;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Aptos Lottery System ✨</h1>
        <div className="wallet-status">
          <p>Connected As: {mockUserAddress}</p>
          {/* In a real app, you'd have connect/disconnect buttons here */}
          {/* <button onClick={() => alert("Simulating wallet connect...")}>Connect Wallet</button> */}
        </div>
      </header>

      <main className="App-main">
        {/* Section for creating a new lottery */}
        <section className="lottery-card create-lottery-section">
          <h2>🎲 Create New Lottery</h2>
          <div className="input-group">
            <input
              type="number"
              placeholder="Ticket Price (APT)"
              value={newLotteryTicketPrice}
              onChange={(e) => setNewLotteryTicketPrice(e.target.value)}
              min="0.01" // Ensure positive price
              step="0.01" // Allow decimal prices
            />
            <button onClick={handleCreateLottery}>Create Lottery</button>
          </div>
        </section>

        {/* Section for displaying current lottery status and actions */}
        <section className="lottery-card current-lottery-section">
          <h2>💰 Current Lottery Status</h2>
          {lottery.active ? (
            <div className="status-info">
              <p className="status-active">Status: **ACTIVE** ✅</p>
              <p>Ticket Price: <span className="highlight">{lottery.ticketPrice} APT</span></p>
              <p>Total Participants: <span className="highlight">{lottery.participants.length}</span></p>
              <p>Prize Pool: <span className="highlight">{prizePool} APT</span></p>
              <div className="action-buttons">
                <button onClick={handleBuyTicket}>Buy a Ticket</button>
                <button onClick={handlePickWinner}>Pick Winner</button>
              </div>
              <h3>Participants:</h3>
              {lottery.participants.length > 0 ? (
                <ul className="participants-list">
                  {lottery.participants.map((address, index) => (
                    <li key={index}>{address}</li>
                  ))}
                </ul>
              ) : (
                <p>No tickets purchased yet. Be the first! 🚀</p>
              )}
            </div>
          ) : (
            <div className="status-info">
              <p className="status-inactive">Status: **INACTIVE** 💤</p>
              {lottery.winner && (
                <p>Last Winner: <span className="highlight">{lottery.winner}</span> 🥳</p>
              )}
              {!lottery.winner && <p>No active lottery or no winner drawn yet.</p>}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;