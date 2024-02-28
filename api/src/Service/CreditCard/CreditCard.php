<?php


namespace App\Service\CreditCard;

/**
 * Class CreditCard
 * @package App\Service\CreditCard
 */
class CreditCard
{
    public const TYPE_AMEX               = 'amex';
    public const TYPE_DANKORT            = 'dankort';
    public const TYPE_DINERS_CLUB        = 'diners_club';
    public const TYPE_DISCOVER           = 'discover';
    public const TYPE_FORBRUGSFORENINGEN = 'forbrugsforeningen';
    public const TYPE_JCB                = 'jcb';
    public const TYPE_MAESTRO            = 'maestro';
    public const TYPE_MASTERCARD         = 'mastercard';
    public const TYPE_UNIONPAY           = 'unionpay';
    public const TYPE_VISA               = 'visa';
    public const TYPE_VISA_ELECTRON      = 'visa_electron';
    public const TYPE_HIPERCARD          = 'hipercard';
    public const TYPE_ELO                = 'elo';
    public const TYPE_MIR                = 'mir';

    protected static array $cards = [
        // Debit cards must come first, since they have more specific patterns than their credit-card equivalents.
        self::TYPE_ELO               => [ // Should be higher then maestro cards detector
            'type'      => self::TYPE_ELO,
            'pattern'   => '/^(40117[8-9]|431274|438935|451416|457393|45763[1-2]|506(699|7[0-6][0-9]|77[0-8])|509\d{3}|504175|627780|636297|636368|65003[1-3]|6500(3[5-9]|4[0-9]|5[0-1])|6504(0[5-9]|[1-3][0-9])|650(4[8-9][0-9]|5[0-2][0-9]|53[0-8])|6505(4[1-9]|[5-8][0-9]|9[0-8])|6507(0[0-9]|1[0-8])|65072[0-7]|6509(0[1-9]|1[0-9]|20)|6516(5[2-9]|[6-7][0-9])|6550([0-1][0-9]|2[1-9]|[3-4][0-9]|5[0-8]))/',
            'format'    => '/(\d{1,4})(\d{1,6})?(\d{1,5})?/',
            'length'    => [16],
            'cvcLength' => [3, 4],
            'luhn'      => true,
        ],
        self::TYPE_VISA_ELECTRON      => [
            'type'      => self::TYPE_VISA_ELECTRON,
            'pattern'   => '/^4(026|17500|405|508|844|91[37])/',
            'length'    => [16],
            'cvcLength' => [3],
            'luhn'      => true,
        ],
        self::TYPE_MAESTRO            => [
            'type'      => self::TYPE_MAESTRO,
            'pattern'   => '/^(5(018|0[23]|[68])|6(3|7))/',
            'length'    => [12, 13, 14, 15, 16, 17, 18, 19],
            'cvcLength' => [3],
            'luhn'      => true,
        ],
        self::TYPE_FORBRUGSFORENINGEN => [
            'type'      => self::TYPE_FORBRUGSFORENINGEN,
            'pattern'   => '/^600/',
            'length'    => [16],
            'cvcLength' => [3],
            'luhn'      => true,
        ],
        self::TYPE_DANKORT            => [
            'type'      => self::TYPE_DANKORT,
            'pattern'   => '/^5019/',
            'length'    => [16],
            'cvcLength' => [3],
            'luhn'      => true,
        ],
        // Credit cards
        self::TYPE_HIPERCARD          => [
            'type'      => self::TYPE_HIPERCARD,
            'pattern'   => '/^(606282\d{10}(\d{3})?)|(3841\d{15})$/',
            'length'    => [16, 19],
            'cvcLength' => [3],
            'luhn'      => true,
        ],
        self::TYPE_AMEX               => [
            'type'      => self::TYPE_AMEX,
            'pattern'   => '/^3[47]/',
            'format'    => '/(\d{1,4})(\d{1,6})?(\d{1,5})?/',
            'length'    => [15],
            'cvcLength' => [3, 4],
            'luhn'      => true,
        ],
        self::TYPE_DINERS_CLUB        => [
            'type'      => self::TYPE_DINERS_CLUB,
            'pattern'   => '/^3[0689]/',
            'length'    => [14],
            'cvcLength' => [3],
            'luhn'      => true,
        ],
        self::TYPE_DISCOVER           => [
            'type'      => self::TYPE_DISCOVER,
            'pattern'   => '/^6([045]|22)/',
            'length'    => [16],
            'cvcLength' => [3],
            'luhn'      => true,
        ],
        self::TYPE_UNIONPAY           => [
            'type'      => self::TYPE_UNIONPAY,
            'pattern'   => '/^(62|88)/',
            'length'    => [16, 17, 18, 19],
            'cvcLength' => [3],
            'luhn'      => false,
        ],
        self::TYPE_JCB                => [
            'type'      => self::TYPE_JCB,
            'pattern'   => '/^35/',
            'length'    => [16],
            'cvcLength' => [3],
            'luhn'      => true,
        ],
        self::TYPE_VISA               => [
            'type'      => self::TYPE_VISA,
            'pattern'   => '/^4/',
            'length'    => [13, 16, 19],
            'cvcLength' => [3],
            'luhn'      => true,
        ],
        self::TYPE_MASTERCARD         => [
            'type'      => self::TYPE_MASTERCARD,
            'pattern'   => '/^(5[0-5]|(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720))/', // 2221-2720, 51-55
            'length'    => [16],
            'cvcLength' => [3],
            'luhn'      => true,
        ],
        self::TYPE_MIR         => [
            'type'      => self::TYPE_MIR,
            'pattern'   => '/^220[0-4][0-9]{12}$/', // 2200
            'length'    => [16],
            'cvcLength' => [3],
            'luhn'      => false,
        ],
    ];

    /**
     * @param $number
     * @param array $types
     * @return array
     */
    public static function validCreditCard($number, $types = []): array
    {
        $ret = [
            'valid'  => false,
            'number' => '',
            'type'   => '',
        ];

        if (!is_array($types)) {
            $types = [$types];
        }

        // Strip non-numeric characters
        $number = preg_replace('/[^0-9]/', '', $number);

        if (empty($types)) {
            $types[] = self::creditCardType($number);
        }

        foreach ($types as $type) {
            if (isset(self::$cards[$type]) && self::validCard($number, $type)) {
                return [
                    'valid'  => true,
                    'number' => $number,
                    'type'   => $type,
                ];
            }
        }

        return $ret;
    }

    /**
     * @param $cvc
     * @param $type
     * @return bool
     */
    public static function validCvc($cvc, $type): bool
    {
        return (ctype_digit($cvc) && array_key_exists($type, self::$cards) && self::validCvcLength($cvc, $type));
    }

    /**
     * @param $year
     * @param $month
     * @return bool
     */
    public static function validDate($year, $month): bool
    {
        $month = str_pad($month, 2, '0', STR_PAD_LEFT);

        if (!preg_match('/^(0[1-9]|1[0-2])$/', $month)) {
            return false;
        }

        // past date
        if ($year < substr(date('Y'), -2) || $year == substr(date('Y'), -2) && $month < date('m')) {
            return false;
        }

        return true;
    }

    /**
     * @param $number
     * @return string
     */
    protected static function creditCardType($number): string
    {
        foreach (self::$cards as $type => $card) {
            if (preg_match($card['pattern'], $number)) {
                return $type;
            }
        }

        return '';
    }

    /**
     * @param $number
     * @param $type
     * @return bool
     */
    protected static function validCard($number, $type): bool
    {
        return (self::validPattern($number, $type) && self::validLength($number, $type) && self::validLuhn($number, $type));
    }

    /**
     * @param $number
     * @param $type
     * @return false|int
     */
    protected static function validPattern($number, $type)
    {
        return preg_match(self::$cards[$type]['pattern'], $number);
    }

    /**
     * @param $number
     * @param $type
     * @return bool
     */
    protected static function validLength($number, $type): bool
    {
        foreach (self::$cards[$type]['length'] as $length) {
            if (strlen($number) == $length) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param $cvc
     * @param $type
     * @return bool
     */
    protected static function validCvcLength($cvc, $type): bool
    {
        foreach (self::$cards[$type]['cvcLength'] as $length) {
            if (strlen($cvc) == $length) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param $number
     * @param $type
     * @return bool
     */
    protected static function validLuhn($number, $type): bool
    {
        if (!self::$cards[$type]['luhn']) {
            return true;
        } else {
            return self::luhnCheck($number);
        }
    }

    /**
     * @param $number
     * @return bool
     */
    protected static function luhnCheck($number): bool
    {
        $checksum = 0;
        for ($i = (2 - (strlen($number) % 2)); $i <= strlen($number); $i += 2) {
            $checksum += (int) substr($number, $i - 1, 1);
        }

        // Analyze odd digits in even length strings or even digits in odd length strings.
        for ($i = (strlen($number) % 2) + 1; $i < strlen($number); $i += 2) {
            $digit = (int) substr($number, $i - 1, 1);
            $digit *= 2;
            if ($digit < 10) {
                $checksum += $digit;
            } else {
                $checksum += ($digit - 9);
            }
        }

        if (($checksum % 10) == 0) {
            return true;
        } else {
            return false;
        }
    }
}