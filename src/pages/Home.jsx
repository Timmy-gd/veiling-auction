/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import './Home.css'
import Categories from '../components/Categories'
import PocketBase from 'pocketbase'
import ItemDetails from './ItemDetails'

const pb = new PocketBase("https://pocketbase-render-ycpw.onrender.com");

export default function Home() {
    const [category, setCategory] = useState("");
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [page, setPage] = useState(1);
    const [likedItems, setLikedItems] = useState(() => {
        const storedLikes = localStorage.getItem('likedItems');
        return storedLikes ? JSON.parse(storedLikes) : [];
    });

    const updateFromChild = (val) => {
        setCategory(val);
    };

    useEffect(() => {
        fetchItems();
    }, [page, category]);

    const fetchItems = async () => {
        try {
            const filter = category && category !== "All" ? `categories = "${category}"` : "";

            const result = await pb.collection('items').getList(page, 12, {
                sort: '-created', // latest first
                filter: filter
            });
            setItems(result.items);
        } catch (err) {
            console.error('Failed to fetch items', err);
        }
    };

    const handleLike = async (itemId) => {
        try {
            const itemToUpdate = items.find(item => item.id === itemId);

            if (likedItems.includes(itemId)) {
                // Unlike
                await pb.collection('items').update(itemId, {
                    likes: itemToUpdate.likes - 1,
                });

                const updatedLikedItems = likedItems.filter(id => id !== itemId);
                setLikedItems(updatedLikedItems);
                localStorage.setItem('likedItems', JSON.stringify(updatedLikedItems));

                setItems(prevItems =>
                    prevItems.map(item =>
                        item.id === itemId ? { ...item, likes: item.likes - 1 } : item
                    )
                );
            } else {
                await pb.collection('items').update(itemId, {
                    likes: itemToUpdate.likes + 1,
                });

                const updatedLikedItems = [...likedItems, itemId];
                setLikedItems(updatedLikedItems);
                localStorage.setItem('likedItems', JSON.stringify(updatedLikedItems));

                setItems(prevItems =>
                    prevItems.map(item =>
                        item.id === itemId ? { ...item, likes: item.likes + 1 } : item
                    )
                );
            }
        } catch (err) {
            console.error('Failed to like/unlike item', err);
        }
    };


    if (selectedItem) {
        return <ItemDetails item={selectedItem} onBack={() => { setSelectedItem(null); fetchItems(); }} />
    }

    return (
        <>
            <div className="parent">
                <div className="left">
                    <div className='home-quote'><p>“A work is finished when an artist realizes his intentions.”</p></div>
                </div>
                <div className="top-right">
                    <div className='painting1'></div>
                    <div className='painting2'></div>
                    <div className='painting3'></div>
                </div>
                <div className="bottom-right">
                    <div>
                        <p>You want something different? We’ve got assets that speak to you.</p>
                        <button onClick={() => document.getElementById('title-product').scrollIntoView({ behavior: 'smooth' })}>Explore Assets</button>
                    </div>
                </div>
            </div>

            <div className='an-info'>
                <p>This is not your grocery shop</p>
                <div></div>
                <p>"We don’t sell products — we offer assets. Real value, no fillers. You’re not here to browse; you’re here to claim. Buy it all or walk away. The higher you bid, the more you take. That’s the game."</p>
            </div>

            <div className='product-page'>
                <div className='title-products' id='title-product'>
                    <p>Assets</p>
                    <Categories sendValue={updateFromChild} selected={category} />
                </div>

                <div className="listing-products">
                    <div className="grid-container">
                        {items.length > 0 ? (
                            items.map(item => (
                                <div
                                    key={item.id}
                                    className="grid-item"
                                    onClick={() => setSelectedItem(item)}
                                >
                                    <p>{item.uploaded_by}</p>
                                    <img
                                        src={`https://pocketbase-render-ycpw.onrender.com/api/files/items/${item.id}/${item.field}`}
                                        alt={item.item}
                                        className="grid-item-image"
                                    />
                                    {/* Like button */}
                                    <div className='item-decp'>
                                        <div className='item-like'>
                                            <p>${item.current_price === 0 ? item.initial_price : item.current_price}</p>
                                            <div className='like-a1'>
                                                <label class="ui-like" onClick={(e) => { e.stopPropagation(); handleLike(item.id); }}>
                                                    <input type="checkbox" />
                                                    <div class="like">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill=""><g stroke-width="0" id="SVGRepo_bgCarrier"></g><g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"><path d="M20.808,11.079C19.829,16.132,12,20.5,12,20.5s-7.829-4.368-8.808-9.421C2.227,6.1,5.066,3.5,8,3.5a4.444,4.444,0,0,1,4,2,4.444,4.444,0,0,1,4-2C18.934,3.5,21.773,6.1,20.808,11.079Z"></path></g></svg>
                                                    </div>
                                                </label>
                                                <p>({item.likes})</p>
                                            </div>
                                        </div>
                                        <p>{item.item.slice(0, 20)}...</p>
                                        <p>initialy ${item.initial_price}</p>

                                    </div>




                                </div>
                            ))
                        ) : (
                            <div className='eyes'>
                                <div>
                                    <div class="loader"></div>
                                    <div class="loader"></div>
                                </div>
                                <p>Loading....</p>
                            </div>
                        )}
                    </div>

                    {items.length > 0 && (
                        <div className="pagination">
                            <button className="login-button-2" onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1}>←</button>
                            <span>{page}</span>
                            <button className="login-button-2" onClick={() => setPage(prev => prev + 1)}>→</button>
                        </div>
                    )}
                </div>
            </div>
            <div style={{padding: "50px"}}></div>
        </>
    )
}
