import axios from "axios";
import { useEffect, useState } from "react"
import ReactModal from "react-modal";
import "./feed.css";

export const Feed = () => {
let [posts,setPosts] = useState([]);
let [isOpenModal,setIsOpenModal] = useState(false);
let [tempCaption,setTempCaption] = useState("");
let [tempImage,setTempImage] = useState("")
let [tempImageFile,setTempImageFile] = useState(null)
const getPosts = async() => {
let res = await axios.get("http://localhost:3000/posts")
console.log('res',res);
res = res.data.data.reverse();
setPosts(res);

}
useEffect(()=>{
getPosts()
},[])
const Post = async() =>{
    if(!tempImageFile) return;
    let formData = new FormData();
    formData.append("caption",tempCaption);
    formData.append("image",tempImageFile);
    let res = await axios.post('http://localhost:3000/create-post',formData)
    console.log('res',res)
    setTempImage("")
    setTempCaption("")
    setIsOpenModal(false);
    getPosts()
}
    return(
        <>
       <main className="feed-page">
       <header className="feed-header">
         <div>
            <p className="feed-eyebrow">YOUR SPACE</p>
            <h1>Feed</h1>
         </div>
        <button className="create-post-button" onClick={()=>setIsOpenModal(true)} aria-label="Create a post">+</button>
       </header>
        <section className="post-list" aria-label="Posts">
                {
                    posts?.map((p,i)=>(
                        <article key={i} className="post-card">
                            <img className="post-image" src={p.image} alt={p.caption} />
                            <p className="post-caption">{p.caption}</p>
                        </article>
                    ))
                }
        </section>
       </main>

<ReactModal isOpen={isOpenModal} className="post-modal" overlayClassName="post-modal-overlay">
    <h2 className="modal-title">Create a post</h2>
    <p className="modal-description">Share a moment with your community.</p>
    <label className="field-label" htmlFor="post-image">Photo</label>
    <input id="post-image" className="image-input" onChange={(e)=>{
    let url = URL.createObjectURL(e.target.files[0])
    setTempImage(url)
    setTempImageFile(e.target.files[0])
    }} type="file" />
    <label className="field-label" htmlFor="post-caption">Caption</label>
    <input id="post-caption" className="caption-input" type="text" onChange={({target})=>setTempCaption(target.value)} placeholder="Write something about your photo..." />
    <div className="modal-actions">
        <button className="button button-secondary" onClick={()=>setIsOpenModal(false)}>Cancel</button>
        <button className="button button-primary" onClick={Post}>Share post</button>
    </div>
 {
    tempImage?<div className="post-preview">
                            <img className="preview-image" src={tempImage} alt="Selected post preview" />
                            <p className="preview-caption">{tempCaption==""?<span className="empty-caption">No caption yet</span>:tempCaption}</p>
 </div>:<p className="preview-placeholder">Your image preview will appear here.</p>
 }
</ReactModal>
        </>
    )
}