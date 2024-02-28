<?php


namespace App\Service\Validation;

use App\Service\CreditCard\CreditCard;


/**
 * Class AttributeValidationSingleton
 * @package App\Service\Validation
 */
class AttributeValidationSingleton
{

    /**
     * @var AttributeValidationSingleton|null
     */
    private static ?AttributeValidationSingleton $instance = null;

    /**
     * @return AttributeValidationSingleton
     */
    public static function getInstance(): AttributeValidationSingleton
    {
        if (null === static::$instance) {
            static::$instance = new static();
        }

        return static::$instance;
    }

    /**
     * @param string $value
     * @param array $errors
     * @return void
     */
    public function validateIp(string $value, array &$errors): void
    {

    }

    /**
     * @param string $value
     * @param array $errors
     * @return void
     */
    public function validateClientAgent(string $value, array &$errors): void
    {

    }

    /**
     * @param string $value
     * @param array $errors
     * @return void
     */
    public function validateCardNumber(string $value, array &$errors): void
    {
        if (empty(preg_replace('/-/', "", $value))) {
            $errors["cardNumber"] = "Введите номер банковской карты";
        }

        $card = CreditCard::validCreditCard(preg_replace('/-/', "", $value), [
            CreditCard::TYPE_VISA,
            CreditCard::TYPE_MASTERCARD,
            CreditCard::TYPE_VISA_ELECTRON,
            CreditCard::TYPE_MIR
        ]);

        if (!$card["valid"]) {
            $errors["cardNumber"] = "Кредитная карта невалидна";
        }
    }

    public function validateContacts(string $value, array &$errors): void
    {
        if (strlen($value) > 500) {
            $errors["contacts"] = "Значение недолжно превышать 500 символов";
        }

        if (preg_match('([/<>*&$#?]+)', $value)) {
            $errors["contacts"] = "Значение содержит недопустимые символы, а именно: /<>*&$#?";
        }

    }

    /**
     * @param string $value
     * @param array $errors
     * @return void
     */
    public function validateExpiryMonth(string $value, array &$errors): void
    {
        if (empty($value)) {
            $errors["expiryMonth"] = "Значение не должно быть пустым";
        }

        if (!preg_match('/^(0?[1-9]|1[012])$/', $value)) {
            $errors["expiryMonth"] = "Месяц не валиден";
        }
    }

    /**
     * @param string $value
     * @param array $errors
     * @return void
     */
    public function validateExpiryYear(string $value, array &$errors): void
    {
        if (empty($value)) {
            $errors["expiryYear"] = "Значение не должно быть пустым";
        }

        if (!preg_match('/^(2)\d$/', $value)) {
            $errors["expiryYear"] = "Год не валиден";
        }

        if ($value < substr(date('Y'), -2)) {
            $errors["expiryYear"] = "Дата уже истекла";
        }
    }

    /**
     * @param string $value
     * @param array $errors
     * @return void
     */
    public function validateCardHolder(string $value, array &$errors): void
    {
        if (empty($value)) {
            $errors["cardHolder"] = "Введите имя и фамилию";
        }

        if (!preg_match('/^([A-zA-яёЁїЇІі\- ]{2,20})$/', $value)) {
            $errors["cardHolder"] = "Некорректные данные";
        }
    }

    /**
     * @param string $value
     * @param array $errors
     * @return void
     */
    public function validateCardHolderCountry(string $value, array &$errors): void
    {
        if (empty($value)) {
            $errors["cardHolderCountry"] = "Введите код страны";
        }

        if (!preg_match('/^[A-Z]{2,3}$/', $value)) {
            $errors["cardHolderCountry"] = "Неверный код страны";
        }
    }

    /**
     * @param string $value
     * @param array $errors
     * @return void
     */
    public function validateCardHolderCity(string $value, array &$errors): void
    {
        if (empty($value)) {
            $errors["cardHolderCity"] = "Введите название города";
        }

        if (!preg_match('/^[A-Z][a-z]{2,}$/', $value)) {
            $errors["cardHolderCity"] = "Город должен быть с заглавной буквы, не содержать цифр и состоять исключительно из латинских букв";
        }
    }

    /**
     * @param string $value
     * @param array $errors
     * @return void
     */
    public function validateCardHolderDOB(string $value, array &$errors): void
    {
        if (empty($value)) {
            $errors["cardHolderDOB"] = "Значение не должно быть пустым";
        }

        if (!preg_match('/^(0[1-9]|1[012])\.(0?[1-9]|1[012])\.([0-9]{2})$/D', $value)) {
            $errors["cardHolderDOB"] = "Некорректная дата рождения (Пример: 01.01.2021)";
        }
    }

    /**
     * @param string $value
     * @param array $errors
     * @return void
     */
    public function validateEmail(string $value, array &$errors): void
    {
        if (empty($value)) {
            $errors["email"] = "Введите email";
        }

        if (!preg_match('/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/', $value)) {
            $errors["email"] = "Неверный email";
        }
    }

    /**
     * @param string $value
     * @param array $errors
     * @return void
     */
    public function validateWallet(string $value, array &$errors): void
    {
        if (empty($value)) {
            $errors["wallet"] = "Введите кошелек криптовалюты";
        }
    }
}