export default function DeleteCommentModal() {
    return (
        <div className="comment-modal">
            <input type="checkbox" id="modal-toggle-comment-delete" className="modal-toggle" />
            <div className="modal">
                <div className="modal-wrapper">
                    <div className="modal-header">
                        <h4><i className="fa-solid fa-trash"></i> Confirm delete</h4>
                        <label htmlFor="modal-toggle-comment-delete" className="modal-close"><i
                            className="fa-solid fa-rectangle-xmark"></i></label>
                    </div>
                    <div className="modal-content">
                        <form action="#" method="post" className="form">
                            <div className="control-comment">
                                <textarea readOnly rows="5" cols="60" name="comment" type="text" id="comment"
                                    className="input invalid valid comment">

                                </textarea>
                            </div>
                            <div className="form-buttons">
                                <a href="#" className="btn btn-post delete"><i className="fa-solid fa-triangle-exclamation"></i>
                                    Delete</a>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <label htmlFor="modal-toggle-comment-delete" className="modal-close"><i className="fa-solid fa-xmark"></i>
                            Close</label>
                    </div>
                </div>
            </div>
        </div>
    );
}