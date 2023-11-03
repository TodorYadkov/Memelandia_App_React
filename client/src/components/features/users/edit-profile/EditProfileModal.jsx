export default function EditProfileModal() {
    return (
        <div className="comment-modal">
            <input type="checkbox" id="modal-toggle-edit-user-details" className="modal-toggle" />
            <div className="modal">
                <div className="modal-wrapper">
                    <div className="modal-header">
                        <h4><i className="fa-solid fa-user-pen"></i> Edit Profile</h4>
                        <label htmlFor="modal-toggle-edit-user-details" className="modal-close"><i
                            className="fa-solid fa-rectangle-xmark"></i></label>
                    </div>
                    <div className="modal-content">
                        {/* <!-- Use class valid and invalid when validate form --> */}
                        TODO: Create direct with React
                        {/* <!-- <form action="#" method="post" className="form">
                            <div className="control-username">
                                <label htmlFor="username" className="label username">Username</label>
                                <input type="text" type="text" id="username" className="input valid username" placeholder="Username" />
                            </div>
                            <div className="control-email">
                                <label htmlFor="email" className="label email">Email</label>
                                <input type="email" type="text" id="email" className="input invalid email" placeholder="Email" />
                            </div>
                            <div className="control-name">
                                <label htmlFor="name" className="label name">Name</label>
                                <input type="name" type="text" id="name" className="input name" placeholder="Name" />
                            </div>
                            <div className="control-age">
                                <label htmlFor="age" className="label age">Age</label>
                                <input type="age" type="text" id="age" className="input age" placeholder="Age" />
                            </div>
                            <div className="control-password">
                                <label htmlFor="password" className="label password">Password</label>
                                <input type="password" type="text" id="password" className="input password" placeholder="Password" />
                            </div>
                            <div className="control-rePass">
                                <label htmlFor="rePass" className="label rePass">Confirm Password</label>
                                <input type="password" type="text" id="rePass" className="input rePass" placeholder="Confirm Password" />
                            </div>
                            <div className="form-buttons">
                                <a href="#" className="btn btn-register">REGISTER</a>
                                <a href="#" className="btn btn-link">I already have an account</a>
                            </div>
                        </form> --> */}
                    </div>
                    <div className="modal-footer">
                        <label htmlFor="modal-toggle-edit-user-details" className="modal-close"><i className="fa-solid fa-xmark"></i>
                            Close</label>
                    </div>
                </div>
            </div>
        </div >
    );
}