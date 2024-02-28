import React from "react";

import CryptoDictionaryHead from "./crypto-dictionary-head";
import { StyledDictionaryItem } from "../styled-crypto-dictionary";

const CryptoDictionaryItemB = () => {
  return (
    <div id="B">
      <CryptoDictionaryHead current="B" />
      <StyledDictionaryItem id="Baghodler">
        <h2>Baghodler</h2>{" "}
        (Багходлер) – данный термин подразумевает неудачную долгосрочную
        стратегию, в которой за основу было взято удержание цифрового актива до более высокого
        показателя рыночного курса, однако – актив обесценился. Любая криптовалюта периодически, а
        иногда и часто показывает спад. У трейдера всегда есть выбор между: поддаться панике и
        немедленно продать активы или ходлить актив до изменения ситуации. Если ожидаемого
        исправления не случилось, и инвестор потерял больше, чем мог потерять изначально, то к нему
        и применим термин «Baghodler».
      </StyledDictionaryItem>
      <StyledDictionaryItem id="Bear">
        <h2>Bear</h2>{" "}
        (Медведь) – термин в биржевой торговле, которым обозначают трейдеров,
        продающих криптовалюту в больших количествах на пике её высокого курса, а затем снижая ее
        курс и распространяя мнение о том, что курс будет падать, что в свою очередь создаст
        активную продажу необходимой криптовалюты, что поможет трейдеру скупить её по более низкой
        цене обратно, и получить с этого выгоду. Аналогию с таким названием трейдеров, взяли из
        поведенческого характера животного, поскольку медведь всегда пытается придавить свою жертву
        к земле. Похожие действия с курсом криптовалюты делают и «трейдеры-медведи». Однако, после
        того как медведь скупил криптовалюту по низкому курсу, он на время становится <a
        href="#Bull"
      >«быком»</a> и ждёт
        удачного момента для продажи. Противоположным термином определению «медведь», является
        термин <a href="#Bull">«бык»</a>.
      </StyledDictionaryItem>
      <StyledDictionaryItem id="BearMarket">
        <h2>Bear Market</h2>{" "}
        (Медвежий рынок) – состояние рынка, при котором цены на цифровые активы
        падают, идет снижение цены на валютную пару, и другие трейдеры усиливают данную тенденцию
        активной продажей валюты. Обычно это сопровождается широким распространением пессимизма,
        который в свою очередь поддерживает поток негативных настроений. Его противоположностью
        является <a href="#BullMarket">«бычий рынок»</a>, при котором настроения по отношению к
        ценам являются позитивными.
      </StyledDictionaryItem>
      <StyledDictionaryItem id="Blockchain">
        <h2>Blockchain</h2>{" "}
        (Блокчейн) – понятие «Блокчейн» стало активно обсуждаться с ростом популярности криптовалюты.
        Считается, что эта технология способна стать настоящим прорывом в области финансов и защищенных баз данных.
        Блокчейн – это цепочка блоков, каждый из которых обладает меткой времени, ссылкой на предыдущий блок и хранится
        на разных компьютерах. Если не вдаваться в технические нюансы, то сам принцип работы блокчейна довольно прост.
        Его можно представить как учетную книгу, которая есть у каждого участника события и которая постоянно
        обновляется. По сути, в эту книгу можно вписать любое событие — от финансовых операций с криптовалютами Bitcoin,
        Etherum и т. д. до результатов голосования на выборах президента или идентификационных данных. Фишка блокчейна в
        том, что страницы (читай блоки) этой книги одновременно хранятся у всех пользователей сети, постоянно
        обновляются и ссылаются на старые страницы. И если кто-то попытается обмануть систему, вырвав или вклеив в книгу
        какую-то страницу, то система сразу же обратиться к десяткам тысяч других версий этой книги и обнаружит
        несоответствие в структуре блоков. Базовая система блокчейна представляет из себя постоянно растущую
        последовательность блоков, которые разделяются между участниками с помощью пиринговых сетей, которыми
        большинство людей пользуются для скачки и раздачи торрентов. В каждый блок добавляется временная отметка
        (хэш-сумма), которую проще всего представить как уникальный отпечаток пальца. Сам термин Blockchain частично
        характеризует его задачи и назначение. Часть «Block» – это блоки, «chain» – это «цепочка». Получается, что
        Blockchain – это цепочка блоков. Причем не просто цепочка. В ней выдерживается строгая последовательность. Что
        это за блоки и что за цепочка? Блоки – это данные о транзакциях, сделках и контрактах внутри системы,
        представленные в криптографической форме. Изначально блокчейн был (и остается до сих пор) основой криптовалюты
        Bitcoin. Все блоки выстроены в цепочку, то есть связаны между собой. Для записи нового блока, необходимо
        последовательное считывание информации о старых блоках. Все данные в блокчейн накапливаются и формируют
        постоянно дополняемую базу данных. С этой базы данных невозможно ничего удалить или провести замену/подмену
        блока. И она «безгранична» – туда может быть записано бесконечное количество транзакций. Это одна из главных
        особенностей блокчейна.
      </StyledDictionaryItem>
      <StyledDictionaryItem id="Bounty">
        <h2>Bounty</h2>{" "}
        (Баунти) – это возможность получить награду в криптовалюте за определенные
        рекламно-информационные действия без необходимости вкладывать свои деньги в проект. В
        основном это касается <a href="#ICO">ICO</a>. Вознаграждение в виде токенов начисляется за
        различного рода пиар. Компания по выпуску токенов особенно заинтересована в раскрутке своей виртуальной
        монеты, поэтому популяризация монеты имеет огромную роль. Это могут быть посты в соцсетях.
        Большой интерес у любителей легкой прибыли вызывает выполнение промоушн-задач, которые не
        требуют больших интеллектуальных усилий – подписываться на соц. сети ICO проекта, делать
        репосты и писать комментарии на форуме. Это больше свойственно для не совсем добросовестного <a
        href="#ICO"
      >ICO</a>. То есть –
        примерно тот же сетевой маркетинг, и раздача дешевых подарков и попытка роспиариться на
        доверчивости пользователей, тем самым, выстроив маркетинговую пирамиду.
      </StyledDictionaryItem>
      <StyledDictionaryItem id="BTFD">
        <h2>BTFD</h2>{" "}
        - "Buy The Fucking Dip" (Купить монету) – приобретение валюты трейдером, когда
        ее цена достигает максимального понижения. Есть большая вероятность того, что цена снова
        подскочит и удастся заработать приличные деньги. BTFD – это буквально призыв покупать
        криптовалюту после падения цен. Это метод трейдинга, предполагающий покупку монеты, которая
        только что резко упала. В том числе, и благодаря <a href="#FUD">FUD</a>. Однако иногда эти
        провалы являются естественными, и те люди, которые применили BTFD, покупая монету, могут оказаться в
        проигрыше, а поэтому вынуждены запускать новую волну <a href="#FOMO">FOMO</a>, чтобы как
        можно скорее восстановить ее цену.
      </StyledDictionaryItem>
      <StyledDictionaryItem id="Bull">
        <h2>Bull</h2>{" "}
        (Бык) – торговец, который считает, что цена на конкретную криптовалюту будет
        расти. Быки самый положительный и любимый всеми вид трейдеров. По аналогии с животным миром
        и быками, такое прозвище им дали за то, что бык при атаке подбрасывает свою жертву вверх,
        что они и делают с курсом криптовалюты, то есть – подымают на рога, за что и получили такое
        прозвище. Данный вид трейдеров всегда стараются повысить цену криптоактивов. Когда говорят
        про «бычий тренд» или «бычий рынок» имеют ввиду, что актив дорожает в течении
        продолжительного времени. В честь трейдеров, продолжавших правое дело, которые активно
        повышали рост курсов на биржах, в Нью-Йорке на Уолл Стрит перед северным входом в сквер
        Боулинг-Грин установили памятник быку, из бронзы, весом в три с половиной тонны. Это
        прообраз напористых биржевых игроков и символ необузданного капитализма. Противоположным
        термином определению «бык», является термин <a href="#Bear">«медведь»</a>.
      </StyledDictionaryItem>
      <StyledDictionaryItem id="BullMarket">
        <h2>Bull Market</h2>{" "}
        (Бычий рынок) – состояние рынка, при котором цены на биржах растут, а
        мнение широкой общественности о рынке является положительным, цены растут, или, как
        ожидается, начнут расти в ближайшем будущем. Термин «бычий рынок» чаще всего используется
        по
        отношению к фондовому рынку, но может быть применен к любым торгуемым активам, таким как
        облигации, валюта, сырье и цифровые активы (криптовалюта). Бычьи рынки характеризуются
        оптимизмом, доверием инвесторов и ожиданиями, что хорошие результаты будут продолжаться.
        Продолжительность роста активов (бычьего рынка), как правило, длится от нескольких месяцев,
        до нескольких лет. Очень трудно постоянно предсказывать, когда изменится тренд на рынке.
        Часть трудности заключается в том, что психологические эффекты и ожидания инвесторов могут
        иногда играть большую роль в развитии рынка. Противоположностью «бычьего рынка» является <a
        href="#BearMarket"
      >«медвежий рынок»</a>, при котором настроения по отношению к ценам
        являются негативными.
      </StyledDictionaryItem>
    </div>
  );
};

export default CryptoDictionaryItemB;