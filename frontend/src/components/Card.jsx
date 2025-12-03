import { clsx } from 'clsx';

export const Card = ({
    children,
    variant = 'default',
    hover = true,
    className = '',
    ...props
}) => {
    const variants = {
        default: 'card',
        gradient: 'card-gradient'
    };

    return (
        <div
            className={clsx(
                variants[variant],
                !hover && 'hover:transform-none hover:shadow-none',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
