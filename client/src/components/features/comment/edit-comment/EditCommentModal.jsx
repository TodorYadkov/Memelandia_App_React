export default function EditCommentModal() {
    return (
        <div className="comment-modal">
            <input type="checkbox" id="modal-toggle-comment-edit" className="modal-toggle" />
            <div className="modal">
                <div className="modal-wrapper">
                    <div className="modal-header">
                        <h4><i className="fa-solid fa-pen-to-square"></i> Edit comment</h4>
                        <label htmlFor="modal-toggle-comment-edit" className="modal-close"><i
                            className="fa-solid fa-rectangle-xmark"></i></label>
                    </div>
                    <div className="modal-content">
                        <form action="#" method="post" className="form">
                            <div className="control-comment">
                                <textarea rows="5" cols="60" name="comment" type="text" id="comment"
                                    className="input invalid valid comment">

                                </textarea>
                            </div>
                            <div className="form-buttons">
                                <a href="#" className="btn btn-post"><i className="fa-solid fa-pencil"></i> Edit</a>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <label htmlFor="modal-toggle-comment-edit" className="modal-close"><i className="fa-solid fa-xmark"></i>
                            Close</label>
                    </div>
                </div>
            </div>
        </div>
    );
}