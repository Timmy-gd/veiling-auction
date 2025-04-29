import { useState } from 'react';
import PocketBase from 'pocketbase';
import LoginRegi from '../components/LoginRegi';
import "./ItemDetails.css"

const pb = new PocketBase("https://pocketbase-render-ycpw.onrender.com");

export default function ItemDetails({ item, onBack }) {
    const loggedInUsername = localStorage.getItem('loggedInUsername');
    const [bidAmount, setBidAmount] = useState('');
    const [error, setError] = useState('');
    const [showBidForm, setShowBidForm] = useState(false);
    const [openLogin, isOpenlogin] = useState(false);

    const actualCurrentPrice = item.current_price === 0 ? item.initial_price : item.current_price;


    const handleBid = async () => {
        if (Number(bidAmount) <= actualCurrentPrice) {
            setError(`Your bid must be greater than $${actualCurrentPrice}.`);
            return;
        }
        try {
            await pb.collection('items').update(item.id, {
                current_price: Number(bidAmount),
                bids: item.bids + 1,
                last_bid: loggedInUsername,
            });
            alert("Bid placed successfully!");
            onBack();
        } catch (err) {
            console.error("Failed to place bid:", err);
        }
    };

    return (
        <div style={{ padding: '20px 50px 0px 50px' }} className='background-a1'>
            <button onClick={onBack} className='back-button-1'>←</button>
            <div className='item-container'>
                <img
                    className='product-image'
                    src={`https://pocketbase-render-ycpw.onrender.com/api/files/items/${item.id}/${item.field}`}
                    alt={item.item}
                />
                <div>
                    <p className='item-name-1'>{item.item}</p>
                    <div className='priceing'>
                        <p className='curr-price'>${actualCurrentPrice}</p>
                    </div>
                    <p>uploaded by <strong>{item.uploaded_by}</strong> with starting bid ${item.initial_price}</p>
                    {item.last_bid ? <p className='last-bid'>last bid by {item.last_bid} at ${actualCurrentPrice}</p> : <p className='last-bid'>be the first one to bid</p>}
                    {item.last_bid && <p><strong>Total Bids:</strong> {item.bids}</p>}

                    <div>
                        {loggedInUsername ? (
                            <>
                                {!showBidForm ? (
                                    <button onClick={() => setShowBidForm(true)} className='login-button-2'>Place Your Bid</button>
                                ) : (
                                    <div style={{ marginTop: '10px' }}>
                                        <input
                                            className='input-field-bid'
                                            type="number"
                                            value={bidAmount}
                                            onChange={(e) => setBidAmount(e.target.value)}
                                            min={actualCurrentPrice + 1}
                                            style={{ padding: '8px', width: '150px', marginRight: '10px' }}
                                        />
                                        <button onClick={handleBid} className='login-button-2'>Place Bid</button>
                                        {error && <p style={{ color: 'red' }}>{error}</p>}
                                    </div>
                                )}
                            </>
                        ) : (
                            <button
                                className="login-button-2"
                                onClick={() => {
                                    isOpenlogin(true);
                                }}
                            >
                                Sign-in to place your bid
                            </button>
                        )}
                        <div className="login-page">
                            {openLogin && (
                                <div className="log-overlay">
                                    <div className="log-page">
                                        <button
                                            className="close-button"
                                            onClick={() => isOpenlogin(false)}
                                        >
                                            &times;
                                        </button>
                                        <LoginRegi />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}
