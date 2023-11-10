import styles from './ListMemes.module.css';
import { useForm } from 'react-hook-form';

import { endpoint } from '../../../core/environments/constants';

import { InfiniteScrollComponent } from '../../../shared/infinite-scroll/InfiniteScrollComponent';

export default function ListMemes() {

    const { register, handleSubmit } = useForm({});


    return (
        <section className={`${styles['catalog']} max-width`}>
            <div className={styles['catalog-search']}>
                {/* <!-- Search --> */}
                <div className={styles['search-name']}>
                    {/* <!-- Can use valid and invalid class --> */}
                    <input type="text" placeholder="Search by Name" />
                </div>
                {/* <!-- Filter by category --> */}
                <div className={styles['search-category']}>
                    {/* <!-- Dynamically Generate --> */}
                    <select>
                        <option defaultValue="test">All memes</option>
                        <option defaultValue="Dynamically Generate">Dynamically Generate</option>
                    </select>
                </div>
            </div>

            <div className={styles['all-memes']}>

                <InfiniteScrollComponent endpoint={endpoint.getAllMemes} />

            </div >
        </section >);
}