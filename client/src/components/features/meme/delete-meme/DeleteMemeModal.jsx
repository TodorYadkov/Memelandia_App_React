export default function DeleteMemeModal() {
    return (
        <div className="comment-modal">
            <input type="checkbox" id="modal-toggle-meme-delete" className="modal-toggle" />
            <div className="modal">
                <div className="modal-wrapper">
                    <div className="modal-header">
                        <h4><i className="fa-solid fa-trash"></i> Confirm delete</h4>
                        <label htmlFor="modal-toggle-meme-delete" className="modal-close"><i
                            className="fa-solid fa-rectangle-xmark"></i></label>
                    </div>
                    <div className="modal-content">
                        <div className="form-buttons">
                            <h4>Are you sure you want to delete this meme:</h4>
                            <a href="#" className="btn btn-post delete"><i className="fa-solid fa-triangle-exclamation"></i>
                                Delete</a>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <label htmlFor="modal-toggle-meme-delete" className="modal-close"><i className="fa-solid fa-xmark"></i>
                            Close</label>
                    </div>
                </div>
            </div>
        </div>
    );
}