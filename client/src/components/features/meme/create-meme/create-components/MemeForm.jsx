/* eslint-disable react/prop-types */
import { useState } from 'react';

import styles from '../CreateMeme.module.css';
import Loading from '../../../../shared/loader/Loading';
import { useModal } from '../../../../core/hooks/useModal';
import ConfirmClearFormModal from './ConfirmClearFormModal';
import { MEME_CATEGORY, MEME_FIELD, MEME_INPUT_COUNT, MEME_MAX_INPUT_COUNT, MEME_MIN_INPUT_COUNT } from '../../memeFieldConstants';

export default function MemeForm({
    formValues,                                                                                         // Values from the user input
    inputCount,                                                                                         // How many input fields are shown (Number)
    template,                                                                                           // Currently selected template (used to disable download button if none)
    addMoreInputs,                                                                                      // Add more text boxes (add more input)                                                                              
    resetForm,                                                                                          // Reset all states to initial
    submitHandler,                                                                                      // Send form data values to parent (CreateMeme)
    saveCurrentInputState,                                                                              // When the onChange event is trigger, dynamically saves data from each field
    handleDecreaseInputCount,                                                                           // Decrease a number of input fields                                                                                      
    onUserImageUpload,                                                                                  // When user upload their image set this image like a template
    onDownload,                                                                                         // Set true, false to isDownload (in parent CreateMeme component)
    onCreate,                                                                                           // Set true, false to isCreate (in parent CreateMeme component)
    isLoading,                                                                                          // Use to show and hide loading spinner
}) {
    const [formErrors, setFormErrors] = useState({ name: '', category: '' });                           // Form errors state
    const [isValidForm, setIsValidForm] = useState(false);                                              // Disable and enable button to create new meme        

    const [isShownConfirmModal, setIsShownConfirmModal] = useModal();                                   // Show, hide confirm modal to clear form

    const handleDownloadClick = () => {                                                                 // When the user is clicked on download change state on parent
        onDownload();                                                                                   // Trigger in ImageDisplay download functionality
    };

    const handleSubmitClick = (e) => {                                                                  // Use to submit form to the parent and trigger create in ImageDisplay
        submitHandler(e);                                                                               // Submit form data to parent element
        onCreate();                                                                                     // Trigger capture of current meme screenshot and prepare data for cloud upload
    };

    const handleFileUpload = (e) => {                                                                   // Use to upload a custom local file
        const file = e.target.files[0];                                                                 // Get current file

        if (file) {                                                                                     // https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications
            const reader = new FileReader();
            reader.onloadend = () => {
                onUserImageUpload(reader.result);
            };

            reader.readAsDataURL(file);
        }
    };

    const validateUserInput = () => {                                                                   // Validate user input
        if (formValues['name']) {                                                                       // Check if has value      
            if (formValues['name'].length < 2 && formValues['name'] !== '') {                           // Check for minimum string length
                setIsValidForm(false);                                                                  // Set valid form state to false
                setFormErrors({ name: 'Name must be at least two characters long' });                   // Set new error message
                return;

            } else if (formValues['name'].length > 50) {                                                // Check for max string length                                         
                setIsValidForm(false);                                                                  // Set valid form state to false
                setFormErrors({ name: 'Name must not exceed fifty characters' });                       // Set new error message
                return;
            }

            setFormErrors(state => ({ ...state, name: '' }));                                           // If has name and not error clear error for current field
        }

        if (MEME_CATEGORY.includes(formValues['category'] === false)) {                                 // Check if the user is input with correct value
            setIsValidForm(false);                                                                      // Set valid form state to false
            setFormErrors({ category: `${formValues['category']} is not supported` });                  // Set new error message
            return;
        }

        if (!formValues['name'] || !formValues['category']) {
            setIsValidForm(false);
            setFormErrors({ name: '', category: '' });
            return;
        }

        setFormErrors({ name: '', category: '' });                                                      // Clear all errors
        setIsValidForm(true);                                                                           // Form is valid
    };

    return (
        <div className={styles['create-actions']}>
            <form onSubmit={handleSubmitClick} method="post" className={styles['form']}>
                <div className={styles['control']}>
                    <label
                        className={styles['label']}
                        htmlFor={MEME_FIELD.name}
                    >Name</label>
                    <input
                        id={MEME_FIELD.name}
                        name={MEME_FIELD.name}
                        type="text"
                        placeholder='* Name of the meme'
                        className={`${styles['input']} ${formErrors?.name ? styles['invalid'] : ''}`}
                        value={formValues[MEME_FIELD.name] || ''}
                        onChange={saveCurrentInputState}
                        onBlur={validateUserInput}
                        required
                        minLength={2}
                        maxLength={50}
                    />
                    {formErrors?.name && (<p className={styles['error-message']}><span>{formErrors?.name}</span></p>)}
                </div>

                <div className={styles['control']}>
                    <label
                        className={styles['label']}
                        htmlFor={MEME_FIELD.category}
                    >Category</label>
                    <select
                        id={MEME_FIELD.category}
                        name={MEME_FIELD.category}
                        className={`${styles['input']} ${styles['select']}`}
                        value={formValues[MEME_FIELD.category] || ''}
                        onChange={saveCurrentInputState}
                        onBlur={validateUserInput}
                    >
                        <option value="">* Select Category</option>
                        {MEME_CATEGORY.map(categoryName => (
                            <option key={categoryName} value={categoryName}>{categoryName}</option>)
                        )}
                    </select>

                    {formErrors?.category && (<p className={styles['error-message']}><span>{formErrors?.category}</span></p>)}
                </div>

                <div className={styles['control']}>
                    <label
                        className={styles['label']}
                        htmlFor="top-text"
                    >Top Text</label>
                    <input
                        id="top-text"
                        name='top-text'
                        type="text"
                        placeholder='Top text'
                        className={`${styles['input']} ${styles['meme-text']}`}
                        value={formValues['top-text'] || ''}
                        onChange={saveCurrentInputState}
                    />

                    <div className={styles['input-options']}>
                        <label
                            className={`${styles['label']} ${styles['font-size']}`}
                            htmlFor="fsz"
                        >Font Size Top</label>
                        <input
                            id="fsz"
                            name="fsz-top"
                            type="range"
                            className={styles['input-font-size']}
                            value={formValues['fsz-top'] || '22'}
                            onChange={saveCurrentInputState}
                            min="12"
                            max="120"
                        />

                        <label
                            className={`${styles['label']} ${styles['color']}`}
                            htmlFor="color-text-top"
                        ><i className="fa-solid fa-fill-drip"></i></label>
                        <input
                            id="color-text-top"
                            name="color-text-top"
                            type="color"
                            className={styles['input-color']}
                            value={formValues['color-text-top'] || '#ffffff'}
                            onChange={saveCurrentInputState}
                        />

                        <label
                            className={`${styles['label']} ${styles['color']}`}
                            htmlFor="color-outline-top"
                        ><i className="fa-solid fa-paintbrush"></i></label>
                        <input
                            id="color-outline-top"
                            name="color-outline-top"
                            type="color"
                            className={styles['input-color']}
                            value={formValues['color-outline-top'] || '#000000'}
                            onChange={saveCurrentInputState}
                        />
                    </div>
                </div>

                {inputCount > 2 && (Array(inputCount - MEME_INPUT_COUNT).fill('new_input').map((_, index) => (
                    <div key={index} className={styles['control']}>
                        <label
                            className={styles['label']}
                            htmlFor={`optional-text-${index + 1}`}
                        >{`Additional text ${index + 1}`}</label>
                        <input
                            id={`optional-text-${index + 1}`}
                            name={`optional-text-${index + 1}`}
                            type="text"
                            placeholder={`Additional text ${index + 1}`}
                            className={`${styles['input']} ${styles['meme-text']}`}
                            value={formValues[`optional-text-${index + 1}`] || ''}
                            onChange={saveCurrentInputState}
                        />

                        <div className={styles['input-options']}>
                            <label
                                className={`${styles['label']} ${styles['font-size']}`}
                                htmlFor="fsz"
                            >{`Additional text Font Size ${index + 1}`}</label>

                            <input
                                id="fsz"
                                name={`fsz-${index + 1}`}
                                type="range"
                                className={styles['input-font-size']}
                                value={formValues[`fsz-${index + 1}`] || '22'}
                                onChange={saveCurrentInputState}
                                min="12"
                                max="120"
                            />

                            <label
                                className={`${styles['label']} ${styles['color']}`}
                                htmlFor={`color-text-${index + 1}`}
                            ><i className="fa-solid fa-fill-drip"></i></label>
                            <input
                                id={`color-text-${index + 1}`}
                                name={`color-text-${index + 1}`}
                                type="color"
                                className={styles['input-color']}
                                value={formValues[`color-text-${index + 1}`] || '#ffffff'}
                                onChange={saveCurrentInputState}
                            />

                            <label
                                className={`${styles['label']} ${styles['color']}`}
                                htmlFor={`color-outline-${index + 1}`}
                            ><i className="fa-solid fa-paintbrush"></i></label>
                            <input
                                id={`color-outline-${index + 1}`}
                                name={`color-outline-${index + 1}`}
                                type="color"
                                className={styles['input-color']}
                                value={formValues[`color-outline-${index + 1}`] || '#000000'}
                                onChange={saveCurrentInputState}
                            />
                        </div>
                    </div>
                ))
                )}
            
                <div className={`${styles['control']} ${styles['last-element']}`}>
                    <label
                        className={styles['label']}
                        htmlFor="bottom-text"
                    >Bottom Text</label>
                    <input
                        id="bottom-text"
                        name="bottom-text"
                        type="text"
                        placeholder='Bottom text'
                        className={`${styles['input']} ${styles['meme-text']}`}
                        value={formValues['bottom-text'] || ''}
                        onChange={saveCurrentInputState}
                    />

                    <div className={styles['input-options']}>
                        <label
                            className={`${styles['label']} ${styles['font-size']}`}
                            htmlFor="fsz-bottom"
                        >Font Size Bottom</label>
                        <input
                            id="fsz-bottom"
                            name="fsz-bottom"
                            type="range"
                            className={styles['input-font-size']}
                            value={formValues['fsz-bottom'] || '22'}
                            onChange={saveCurrentInputState}
                            min="12"
                            max="120"
                        />

                        <label
                            className={`${styles['label']} ${styles['color']}`}
                            htmlFor="color-text-bottom"
                        ><i className="fa-solid fa-fill-drip"></i></label>
                        <input
                            id="color-text-bottom"
                            name="color-text-bottom"
                            type="color"
                            className={styles['input-color']}
                            value={formValues['color-text-bottom'] || '#ffffff'}
                            onChange={saveCurrentInputState}
                        />

                        <label
                            className={`${styles['label']} ${styles['color']}`}
                            htmlFor="color-outline-bottom"
                        ><i className="fa-solid fa-paintbrush"></i></label>
                        <input
                            id="color-outline-bottom"
                            name="color-outline-bottom"
                            type="color"
                            className={styles['input-color']}
                            value={formValues['color-outline-bottom'] || '#000000'}
                            onChange={saveCurrentInputState}
                        />
                    </div>
                </div>

                <div className={styles['form-buttons']}>

                    <div className={styles['forms-buttons-ua']}>
                        <button
                            type="button"
                            className={`${styles['add-text']} ${styles['btn-create']}`}
                            onClick={addMoreInputs}
                            disabled={inputCount >= MEME_MAX_INPUT_COUNT || !template}
                        ><i className="btn fa-solid fa-plus"></i></button>

                        <button
                            type="button"
                            className={`${styles['remove-text']} ${styles['btn-create']}`}
                            onClick={handleDecreaseInputCount}
                            disabled={inputCount <= MEME_MIN_INPUT_COUNT}
                        ><i className="btn fa-solid fa-minus"></i></button>

                        <button
                            type='reset'
                            className={`${styles['reset']} ${styles['btn-create']}`}
                            onClick={setIsShownConfirmModal}
                            disabled={!template}
                        ><i className="btn fa-solid fa-broom"></i></button>
                    </div>

                    <div className={styles['forms-buttons-cdu']}>
                        <label
                            className={`${styles['upload-label']} ${styles['btn-create']}`}
                            htmlFor="image-upload"
                        ><i className="btn fa-solid fa-upload"></i></label>
                        <input
                            id="image-upload"
                            name="image-upload"
                            type="file"
                            className={`${styles['upload-input']} ${styles['btn-create']}`}
                            accept="image/*"
                            onChange={handleFileUpload}
                        />

                        <button
                            type="button"
                            className={`${styles['download']} ${styles['btn-create']}`}
                            onClick={handleDownloadClick}
                            disabled={!template}
                        ><i className="btn fa-solid fa-download"></i></button>

                        {isLoading
                            ? <Loading width={'95px'} height={'40px'} />
                            : (
                                <button
                                    className={`${styles['create']} ${styles['btn-create']}`}
                                    onSubmit={handleSubmitClick}
                                    disabled={(!isValidForm || !template)}
                                ><i className="btn fa-solid fa-floppy-disk"></i></button>
                            )
                        }

                    </div>
                </div>
            </form>

            {isShownConfirmModal && <ConfirmClearFormModal
                modalHandler={setIsShownConfirmModal}
                resetForm={resetForm}
                setIsValidForm={setIsValidForm}
            />}

        </div>
    );
}