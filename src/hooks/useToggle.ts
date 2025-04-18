import { useState } from 'react';

export default (initialValue: boolean): [boolean, () => void] => {
    const [active, setActive] = useState(initialValue);

    const toggle = () => setActive(prevState => !prevState);

    return [active, toggle];
};
