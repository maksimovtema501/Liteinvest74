/* Курс «Лингво»: грамматика, тексты, задания на говорение, тест уровня.
   Грамматика: mc — вопросы с выбором ответа, ПЕРВЫЙ вариант правильный
   (на экране варианты перемешиваются); tr — фразы «русский → английский»
   для сборки предложения или перевода. */
const GRAMMAR = [
/* ---------------- A1 ---------------- */
{ id: "be", lvl: "A1", title: "To be: am / is / are",
  rule: `<p>В русском «Я врач» — без глагола. В английском глагол <b>обязателен</b>: <i>I <b>am</b> a doctor</i>.</p>
<p><b>I am</b> · <b>he / she / it is</b> · <b>you / we / they are</b></p>
<p>Отрицание — <b>not</b> после глагола: <i>I'm not tired</i>. Вопрос — глагол вперёд: <i><b>Are</b> you ready?</i></p>
<p>Разговорно сокращаем: I'm, he's, they're, isn't, aren't.</p>`,
  mc: [["She ___ a teacher.", "is", "are", "am", "be"],
       ["We ___ from Russia.", "are", "is", "am", "be"],
       ["___ you tired?", "Are", "Is", "Am", "Do"],
       ["I ___ not hungry.", "am", "is", "are", "do"]],
  tr: [["Я дома.", "I am at home."], ["Она очень умная.", "She is very smart."], ["Мы не устали.", "We are not tired."],
       ["Ты готов?", "Are you ready?"], ["Это мой брат.", "This is my brother."], ["Где твои ключи?", "Where are your keys?"]] },
{ id: "ps", lvl: "A1", title: "Present Simple — обычные действия",
  rule: `<p>Для того, что бывает <b>регулярно, всегда, вообще</b>: <i>I work in a bank. I drink coffee every day.</i></p>
<p>С <b>he / she / it</b> добавляем <b>-s</b>: <i>She work<b>s</b></i>, <i>He watch<b>es</b></i>. Это самая частая ошибка — следи за ней.</p>
<p>Отрицание: <b>don't / doesn't</b> + глагол без -s: <i>He <b>doesn't</b> like tea.</i></p>
<p>Вопрос: <b>Do / Does</b> вперёд: <i><b>Does</b> she work here?</i></p>
<p>Маркеры: always, usually, often, sometimes, never, every day.</p>`,
  mc: [["He ___ in a bank.", "works", "work", "working", "is work"],
       ["___ you like pizza?", "Do", "Does", "Are", "Is"],
       ["She ___ eat meat.", "doesn't", "don't", "isn't", "not"],
       ["My parents ___ in Moscow.", "live", "lives", "living", "is live"]],
  tr: [["Я работаю каждый день.", "I work every day."], ["Она живёт в Лондоне.", "She lives in London."], ["Он не пьёт кофе.", "He doesn't drink coffee."],
       ["Ты говоришь по-английски?", "Do you speak English?"], ["Мы обычно ужинаем в семь.", "We usually have dinner at seven."], ["Где он работает?", "Where does he work?"]] },
{ id: "there", lvl: "A1", title: "There is / There are — «есть, имеется»",
  rule: `<p>Когда сообщаем, что что-то <b>где-то находится или существует</b>: <i><b>There is</b> a cat in the kitchen</i> — «На кухне (есть) кошка».</p>
<p>Один предмет — <b>there is</b>, много — <b>there are</b>: <i>There are two shops here.</i></p>
<p>Вопрос: <i><b>Is there</b> a bank near here?</i> Отрицание: <i>There <b>isn't</b> any milk.</i></p>
<p>Русский порядок «на кухне есть кошка» переворачиваем: сначала there is, потом что, потом где.</p>`,
  mc: [["___ a supermarket near my house.", "There is", "There are", "It is", "Is there"],
       ["There ___ many people in the park.", "are", "is", "be", "has"],
       ["___ a bank near here?", "Is there", "There is", "Are there", "Has it"],
       ["There ___ any milk in the fridge.", "isn't", "aren't", "don't", "not"]],
  tr: [["В комнате есть стол.", "There is a table in the room."], ["В городе много парков.", "There are many parks in the city."], ["Здесь есть кафе?", "Is there a cafe here?"],
       ["В холодильнике нет воды.", "There isn't any water in the fridge."], ["На улице три машины.", "There are three cars in the street."], ["Тут есть проблема.", "There is a problem."]] },
{ id: "can", lvl: "A1", title: "Can — могу, умею",
  rule: `<p><b>Can</b> + глагол без to: <i>I <b>can</b> swim</i> — «я умею плавать».</p>
<p>Для всех лиц одинаково, без -s: <i>She can drive.</i></p>
<p>Отрицание <b>can't</b>: <i>I can't hear you.</i> Вопрос: <i><b>Can</b> you help me?</i> — так же вежливо просят.</p>`,
  mc: [["She ___ speak three languages.", "can", "cans", "can to", "is can"],
       ["___ you help me, please?", "Can", "Do", "Are", "Does"],
       ["I can't ___ you.", "hear", "to hear", "hearing", "hears"],
       ["He ___ swim. He's afraid of water.", "can't", "don't", "isn't", "not can"]],
  tr: [["Я умею водить машину.", "I can drive a car."], ["Ты можешь мне помочь?", "Can you help me?"], ["Она не умеет готовить.", "She can't cook."],
       ["Можно мне воды?", "Can I have some water?"], ["Мы можем пойти завтра.", "We can go tomorrow."], ["Я тебя не слышу.", "I can't hear you."]] },
{ id: "art", lvl: "A1", title: "Артикли a / an / the",
  rule: `<p>В русском артиклей нет — поэтому их надо вставлять осознанно.</p>
<p><b>a / an</b> — «какой-то один», впервые упоминаем: <i>I have <b>a</b> dog.</i> Перед гласным звуком — <b>an</b>: <i>an apple, an hour</i>.</p>
<p><b>the</b> — «тот самый», понятно какой: <i><b>The</b> dog is very big</i> (моя, про которую сказал). Единственное в своём роде: the sun, the internet.</p>
<p>Ничего не ставим: с именами, во множественном числе «вообще» (<i>I like dogs</i>), с языками, едой «вообще».</p>`,
  mc: [["I have ___ idea.", "an", "a", "the", "—"],
       ["Close ___ door, please.", "the", "a", "an", "—"],
       ["She is ___ doctor.", "a", "the", "an", "—"],
       ["I love ___ music.", "—", "the", "a", "an"]],
  tr: [["У меня есть кошка.", "I have a cat."], ["Солнце очень яркое.", "The sun is very bright."], ["Она инженер.", "She is an engineer."],
       ["Открой окно.", "Open the window."], ["Я люблю собак.", "I love dogs."], ["Это яблоко.", "This is an apple."]] },
{ id: "pc", lvl: "A1", title: "Present Continuous — прямо сейчас",
  rule: `<p>То, что происходит <b>в данный момент</b> или в этот период: <i>I <b>am working</b> now.</i></p>
<p>Формула: <b>am / is / are + глагол-ing</b>.</p>
<p>Сравни: <i>I work in a bank</i> (вообще) — <i>I'm working from home this week</i> (временно, сейчас).</p>
<p>Ещё — договорённости на будущее: <i>I'm meeting Tom tomorrow.</i></p>
<p>Не ставят в -ing глаголы чувств и состояния: know, like, want, need, understand.</p>`,
  mc: [["Look! It ___.", "is raining", "rains", "rain", "raining"],
       ["What ___ you doing?", "are", "do", "is", "does"],
       ["I ___ TV now.", "am watching", "watch", "watching", "am watch"],
       ["She ___ the answer.", "knows", "is knowing", "know", "knowing"]],
  tr: [["Я сейчас работаю.", "I am working now."], ["Что ты делаешь?", "What are you doing?"], ["Она говорит по телефону.", "She is talking on the phone."],
       ["Мы ждём автобус.", "We are waiting for the bus."], ["Идёт дождь.", "It is raining."], ["Я встречаюсь с Анной завтра.", "I am meeting Anna tomorrow."]] },
{ id: "poss", lvl: "A1", title: "Притяжательные: my, your, his… и 's",
  rule: `<p>my — мой, your — твой/ваш, his — его, her — её, its — его (о предмете), our — наш, their — их.</p>
<p>Принадлежность человеку — <b>'s</b>: <i>Tom<b>'s</b> car</i> — машина Тома, <i>my sister's room</i>.</p>
<p>Не путай <b>its</b> (его) и <b>it's</b> (= it is).</p>`,
  mc: [["This is ___ car. (машина Тома)", "Tom's", "Tom", "Toms", "of Tom"],
       ["She loves ___ job.", "her", "his", "she", "hers"],
       ["They sold ___ house.", "their", "there", "they're", "them"],
       ["The dog wants ___ food.", "its", "it's", "it", "his"]],
  tr: [["Это моя сумка.", "This is my bag."], ["Как зовут твою сестру?", "What is your sister's name?"], ["Их дом очень большой.", "Their house is very big."],
       ["Это машина моего отца.", "This is my father's car."], ["Наш учитель строгий.", "Our teacher is strict."], ["Я знаю его брата.", "I know his brother."]] },
/* ---------------- A2 ---------------- */
{ id: "past", lvl: "A2", title: "Past Simple — что было",
  rule: `<p>Законченное действие в прошлом: <i>I <b>worked</b> yesterday.</i></p>
<p>Правильные глаголы: + <b>-ed</b> (worked, played). Неправильные — учим наизусть: go → <b>went</b>, see → <b>saw</b>, buy → <b>bought</b>, have → <b>had</b>, get → <b>got</b>.</p>
<p>Отрицание и вопрос — через <b>did</b>, а глагол возвращается в начальную форму: <i>I <b>didn't go</b>. <b>Did</b> you <b>see</b> him?</i></p>
<p>Маркеры: yesterday, last week, ago, in 2020.</p>`,
  mc: [["I ___ to the cinema yesterday.", "went", "go", "goed", "was go"],
       ["___ you see that film?", "Did", "Do", "Were", "Was"],
       ["She didn't ___ me.", "call", "called", "calls", "calling"],
       ["We ___ a great time last weekend.", "had", "have", "haved", "has"]],
  tr: [["Я видел его вчера.", "I saw him yesterday."], ["Мы купили новую машину.", "We bought a new car."], ["Она не позвонила.", "She didn't call."],
       ["Ты сделал домашку?", "Did you do your homework?"], ["Я жил в Москве два года назад.", "I lived in Moscow two years ago."], ["Где ты был вчера?", "Where were you yesterday?"]] },
{ id: "goingto", lvl: "A2", title: "Going to — собираюсь",
  rule: `<p>Планы и намерения, решённые <b>заранее</b>: <i>I'm <b>going to</b> buy a car.</i></p>
<p>Формула: <b>am / is / are + going to + глагол</b>.</p>
<p>И прогноз по признакам: <i>Look at the clouds! It's going to rain.</i></p>`,
  mc: [["I ___ visit my parents next week.", "am going to", "going to", "will to", "go to"],
       ["Look at the sky! It ___ rain.", "is going to", "goes to", "will to", "is go"],
       ["What ___ you going to do?", "are", "do", "will", "is"],
       ["She is going to ___ a new job.", "start", "starts", "starting", "started"]],
  tr: [["Я собираюсь учить английский.", "I am going to learn English."], ["Мы собираемся переехать.", "We are going to move."], ["Что ты собираешься делать?", "What are you going to do?"],
       ["Сейчас пойдёт дождь.", "It is going to rain."], ["Он не собирается извиняться.", "He is not going to apologise."], ["Я собираюсь бросить курить.", "I am going to quit smoking."]] },
{ id: "will", lvl: "A2", title: "Will — будущее, решения на ходу",
  rule: `<p><b>will + глагол</b>: решение в момент речи, обещание, предсказание «по ощущениям».</p>
<p><i>— The phone is ringing. — I'll answer it!</i> (решил прямо сейчас)</p>
<p><i>I <b>will</b> call you. I promise.</i> Отрицание <b>won't</b>: <i>It won't take long.</i></p>
<p>Разница: going to — план заранее, will — решил сейчас.</p>`,
  mc: [["I'm cold. — I ___ close the window.", "'ll", "am going to", "close", "would"],
       ["Don't worry, it ___ take long.", "won't", "doesn't", "isn't", "not will"],
       ["I think she ___ like it.", "will", "is", "does", "going"],
       ["___ you help me?", "Will", "Do", "Are", "Going"]],
  tr: [["Я тебе позвоню.", "I will call you."], ["Думаю, он придёт.", "I think he will come."], ["Это не займёт много времени.", "It won't take long."],
       ["Я помогу тебе.", "I will help you."], ["Завтра будет холодно.", "It will be cold tomorrow."], ["Ты выйдешь за меня?", "Will you marry me?"]] },
{ id: "comp", lvl: "A2", title: "Сравнение: bigger, the biggest",
  rule: `<p>Короткие слова: <b>-er / the -est</b>: big → bigger → the biggest; cheap → cheaper → the cheapest.</p>
<p>Длинные: <b>more / the most</b>: expensive → more expensive → the most expensive.</p>
<p>Исключения: good → <b>better</b> → <b>the best</b>; bad → <b>worse</b> → <b>the worst</b>.</p>
<p>«Чем» — <b>than</b>: <i>He is taller <b>than</b> me.</i> «Такой же как» — <b>as … as</b>.</p>`,
  mc: [["Moscow is ___ than Kazan.", "bigger", "more big", "biggest", "big"],
       ["This is the ___ film I've ever seen.", "worst", "baddest", "worse", "most bad"],
       ["Gold is more expensive ___ silver.", "than", "then", "as", "that"],
       ["She is the ___ person I know.", "most interesting", "interestingest", "more interesting", "much interesting"]],
  tr: [["Мой брат выше меня.", "My brother is taller than me."], ["Это самый дешёвый отель.", "This is the cheapest hotel."], ["Сегодня лучше, чем вчера.", "Today is better than yesterday."],
       ["Английский проще, чем русский.", "English is easier than Russian."], ["Это самая дорогая машина.", "This is the most expensive car."], ["Он такой же умный, как ты.", "He is as smart as you."]] },
{ id: "some", lvl: "A2", title: "Some / any, much / many",
  rule: `<p><b>some</b> — в утверждениях (и в вежливых просьбах): <i>I have some money.</i></p>
<p><b>any</b> — в вопросах и отрицаниях: <i>Do you have any questions? I don't have any time.</i></p>
<p><b>many</b> — с исчисляемыми (many books), <b>much</b> — с неисчисляемыми (much water, much time). В утверждениях проще сказать <b>a lot of</b>.</p>`,
  mc: [["Do you have ___ brothers?", "any", "some", "much", "a"],
       ["How ___ money do you need?", "much", "many", "lot", "any"],
       ["There aren't ___ eggs.", "any", "some", "much", "no"],
       ["How ___ people were there?", "many", "much", "lot of", "any"]],
  tr: [["У меня есть немного денег.", "I have some money."], ["У тебя есть вопросы?", "Do you have any questions?"], ["У меня нет времени.", "I don't have any time."],
       ["Сколько это стоит?", "How much is it?"], ["Сколько у тебя друзей?", "How many friends do you have?"], ["Хочешь чаю?", "Would you like some tea?"]] },
{ id: "modal", lvl: "A2", title: "Should / must / have to",
  rule: `<p><b>should</b> — совет, «стоит, следует»: <i>You <b>should</b> see a doctor.</i></p>
<p><b>must</b> — сильное «надо» от говорящего, правило: <i>You must wear a seatbelt.</i></p>
<p><b>have to</b> — надо в силу обстоятельств: <i>I <b>have to</b> work tomorrow.</i></p>
<p>Важно: <b>mustn't</b> = нельзя, а <b>don't have to</b> = не обязательно.</p>`,
  mc: [["You look ill. You ___ see a doctor.", "should", "have", "must to", "should to"],
       ["You ___ smoke here. It's forbidden.", "mustn't", "don't have to", "shouldn't to", "haven't"],
       ["Tomorrow is Sunday, I ___ get up early.", "don't have to", "mustn't", "haven't to", "must not"],
       ["She ___ work on Saturdays.", "has to", "have to", "must to", "has"]],
  tr: [["Тебе стоит больше спать.", "You should sleep more."], ["Мне надо идти.", "I have to go."], ["Здесь нельзя парковаться.", "You mustn't park here."],
       ["Тебе не обязательно приходить.", "You don't have to come."], ["Что мне делать?", "What should I do?"], ["Ей приходится много работать.", "She has to work a lot."]] },
{ id: "pp", lvl: "A2", title: "Present Perfect — опыт и результат",
  rule: `<p>Прошлое, важное <b>сейчас</b>, без конкретного времени: <i>I <b>have lost</b> my keys</i> (и сейчас их нет).</p>
<p>Формула: <b>have / has + 3-я форма</b> (done, seen, been, eaten, worked).</p>
<p>Опыт в жизни: <i><b>Have</b> you <b>ever been</b> to London? I've <b>never</b> tried sushi.</i></p>
<p>Маркеры: ever, never, just, already, yet, so far.</p>`,
  mc: [["I ___ never been to Paris.", "have", "has", "had", "am"],
       ["Have you ever ___ sushi?", "tried", "try", "tryed", "trying"],
       ["She ___ just left.", "has", "have", "is", "did"],
       ["I haven't finished ___.", "yet", "already", "just", "ever"]],
  tr: [["Я потерял ключи.", "I have lost my keys."], ["Ты когда-нибудь был в Лондоне?", "Have you ever been to London?"], ["Она только что ушла.", "She has just left."],
       ["Я никогда не пробовал суши.", "I have never tried sushi."], ["Мы уже поели.", "We have already eaten."], ["Он ещё не позвонил.", "He hasn't called yet."]] },
/* ---------------- B1 ---------------- */
{ id: "ppvps", lvl: "B1", title: "Present Perfect или Past Simple",
  rule: `<p>Есть конкретное время в прошлом (yesterday, in 2019, last week, when I was a kid) — <b>Past Simple</b>: <i>I saw him yesterday.</i></p>
<p>Время не названо или период ещё не закончился (today, this week, ever, since, for) — <b>Present Perfect</b>: <i>I've seen him today.</i></p>
<p><b>for / since</b> + Present Perfect: <i>I've lived here <b>for</b> five years / <b>since</b> 2020.</i> (и до сих пор живу)</p>`,
  mc: [["I ___ him two days ago.", "saw", "have seen", "has seen", "see"],
       ["I ___ here since 2019.", "have lived", "lived", "live", "am living"],
       ["When ___ you arrive?", "did", "have", "has", "do"],
       ["She ___ three cups of coffee today.", "has had", "had", "have", "has"]],
  tr: [["Я живу здесь пять лет.", "I have lived here for five years."], ["Я видел его вчера.", "I saw him yesterday."], ["Ты уже был в этом году в отпуске?", "Have you been on holiday this year?"],
       ["Когда ты приехал?", "When did you arrive?"], ["Мы знакомы с 2015 года.", "We have known each other since 2015."], ["Он уволился в прошлом месяце.", "He quit last month."]] },
{ id: "pastc", lvl: "B1", title: "Past Continuous — был в процессе",
  rule: `<p>Действие <b>шло</b> в момент в прошлом: <i>At 8 pm I <b>was watching</b> TV.</i></p>
<p>Формула: <b>was / were + -ing</b>.</p>
<p>Часто вместе с Past Simple: длинное фоновое действие прерывается коротким: <i>I <b>was taking</b> a shower when the phone <b>rang</b>.</i></p>`,
  mc: [["I ___ when you called.", "was sleeping", "slept", "am sleeping", "sleeping"],
       ["What were you ___ at 10 pm?", "doing", "do", "did", "done"],
       ["They ___ dinner when I arrived.", "were having", "was having", "had having", "have"],
       ["While she was cooking, he ___.", "called", "was call", "calling", "calls"]],
  tr: [["Я спал, когда ты позвонил.", "I was sleeping when you called."], ["Что ты делал вчера в восемь?", "What were you doing at eight yesterday?"], ["Шёл дождь.", "It was raining."],
       ["Мы ужинали, когда пришёл Том.", "We were having dinner when Tom came."], ["Она не слушала.", "She wasn't listening."], ["Я шёл домой и встретил друга.", "I was walking home and met a friend."]] },
{ id: "cond1", lvl: "B1", title: "First Conditional — реальное «если»",
  rule: `<p>Реальное условие в будущем: <b>If + Present Simple, will + глагол</b>.</p>
<p><i>If it <b>rains</b>, I <b>will stay</b> at home.</i></p>
<p>Ловушка для русских: после <b>if</b> и <b>when</b> НЕ ставим will, хотя по-русски «если пойдёт дождь» звучит как будущее.</p>
<p><b>unless</b> = if not: <i>I won't go unless you come.</i></p>`,
  mc: [["If it ___ tomorrow, we'll stay home.", "rains", "will rain", "rained", "raining"],
       ["If you study, you ___ pass.", "will", "would", "are", "did"],
       ["I'll call you when I ___.", "arrive", "will arrive", "arrived", "arriving"],
       ["We'll be late ___ we hurry.", "unless", "if", "when", "until"]],
  tr: [["Если пойдёт дождь, я останусь дома.", "If it rains, I will stay at home."], ["Если ты придёшь, я буду рад.", "If you come, I will be happy."], ["Я позвоню, когда приеду.", "I will call when I arrive."],
       ["Если он опоздает, мы уйдём без него.", "If he is late, we will leave without him."], ["Что ты будешь делать, если проиграешь?", "What will you do if you lose?"], ["Если не поторопишься, опоздаешь.", "If you don't hurry, you will be late."]] },
{ id: "cond2", lvl: "B1", title: "Second Conditional — «если бы» сейчас",
  rule: `<p>Нереальное, воображаемое сейчас: <b>If + Past Simple, would + глагол</b>.</p>
<p><i>If I <b>had</b> money, I <b>would buy</b> a house.</i> — «Если бы у меня были деньги…» (но их нет).</p>
<p>С to be можно <b>were</b> для всех: <i>If I <b>were</b> you, I would quit.</i> — классический совет.</p>`,
  mc: [["If I ___ rich, I'd travel the world.", "were", "am", "will be", "would be"],
       ["If I were you, I ___ apologise.", "would", "will", "did", "am"],
       ["What would you do if you ___ a million?", "won", "win", "will win", "would win"],
       ["If she ___ English, she'd get the job.", "spoke", "speaks", "would speak", "speak"]],
  tr: [["Если бы у меня было время, я бы помог.", "If I had time, I would help."], ["На твоём месте я бы не стал.", "If I were you, I wouldn't."], ["Что бы ты сделал, если бы выиграл миллион?", "What would you do if you won a million?"],
       ["Если бы я знал ответ, я бы сказал.", "If I knew the answer, I would tell you."], ["Было бы здорово, если бы ты пришёл.", "It would be great if you came."], ["Если бы я жил у моря, я бы плавал каждый день.", "If I lived by the sea, I would swim every day."]] },
{ id: "passive", lvl: "B1", title: "Пассив: is made, was built",
  rule: `<p>Когда важно действие, а не кто его сделал: <i>The house <b>was built</b> in 1990.</i></p>
<p>Формула: <b>be (в нужном времени) + 3-я форма</b>.</p>
<p>Сейчас: <i>English <b>is spoken</b> here.</i> Прошлое: <i>My bike <b>was stolen</b>.</i> Будущее: <i>It <b>will be done</b> tomorrow.</i> Perfect: <i>It <b>has been sold</b>.</i></p>
<p>Кем — через <b>by</b>: <i>written by Tolstoy</i>.</p>`,
  mc: [["This car ___ in Germany.", "was made", "made", "is make", "was make"],
       ["The letters ___ every day.", "are delivered", "deliver", "are deliver", "delivered"],
       ["My phone ___ yesterday.", "was stolen", "stole", "is stolen", "has stole"],
       ["The work will ___ tomorrow.", "be finished", "finished", "finish", "be finish"]],
  tr: [["Этот дом был построен в 1990 году.", "This house was built in 1990."], ["Здесь говорят по-английски.", "English is spoken here."], ["У меня украли велосипед.", "My bike was stolen."],
       ["Это будет сделано завтра.", "It will be done tomorrow."], ["Книга была написана Толстым.", "The book was written by Tolstoy."], ["Меня пригласили на свадьбу.", "I was invited to the wedding."]] },
{ id: "usedto", lvl: "B1", title: "Used to — раньше (а теперь нет)",
  rule: `<p><b>used to + глагол</b> — привычка или состояние в прошлом, которого больше нет: <i>I <b>used to</b> smoke.</i> — «Раньше я курил».</p>
<p>Отрицание и вопрос: <i>I <b>didn't use to</b> like coffee. <b>Did</b> you <b>use to</b> play football?</i></p>
<p>Не путать с <b>be used to + -ing</b> — «привык к»: <i>I'm used to getting up early.</i></p>`,
  mc: [["I ___ smoke, but I quit.", "used to", "use to", "was used to", "am used to"],
       ["Did you ___ live here?", "use to", "used to", "using to", "used"],
       ["I'm used to ___ early.", "getting up", "get up", "got up", "gets up"],
       ["She ___ like vegetables as a child.", "didn't use to", "didn't used to", "used not", "wasn't use to"]],
  tr: [["Раньше я жил в деревне.", "I used to live in a village."], ["Раньше он много пил.", "He used to drink a lot."], ["Я привык к холоду.", "I am used to the cold."],
       ["Раньше мы были друзьями.", "We used to be friends."], ["Ты раньше занимался спортом?", "Did you use to do sport?"], ["Я привык работать по ночам.", "I am used to working at night."]] },
{ id: "rel", lvl: "B1", title: "Who / which / that — «который»",
  rule: `<p><b>who</b> — о людях: <i>The man <b>who</b> called you is my boss.</i></p>
<p><b>which</b> — о вещах: <i>The car <b>which</b> I bought is red.</i></p>
<p><b>that</b> — универсальный вариант в разговоре для людей и вещей.</p>
<p><b>where</b> — место, <b>whose</b> — чей. Если «который» — дополнение, его можно выкинуть: <i>The film (that) I watched was great.</i></p>`,
  mc: [["The woman ___ lives next door is a doctor.", "who", "which", "where", "whose"],
       ["This is the book ___ I told you about.", "that", "who", "where", "what"],
       ["That's the cafe ___ we first met.", "where", "which", "who", "what"],
       ["He's the guy ___ car was stolen.", "whose", "who", "which", "who's"]],
  tr: [["Это человек, который мне помог.", "This is the man who helped me."], ["Это машина, которую я купил.", "This is the car that I bought."], ["Это место, где я родился.", "This is the place where I was born."],
       ["Девушка, которая там стоит, моя сестра.", "The girl who is standing there is my sister."], ["Фильм, который мы смотрели, был скучным.", "The film we watched was boring."], ["У меня есть друг, отец которого пилот.", "I have a friend whose father is a pilot."]] },
{ id: "ger", lvl: "B1", title: "Gerund или infinitive: doing / to do",
  rule: `<p>Часть глаголов требует <b>-ing</b>: enjoy, avoid, finish, mind, keep, can't stand, suggest: <i>I enjoy <b>reading</b>.</i></p>
<p>Часть — <b>to + глагол</b>: want, decide, hope, plan, promise, refuse, need, would like: <i>I decided <b>to stay</b>.</i></p>
<p>После предлогов — всегда -ing: <i>I'm good at <b>cooking</b>. Thanks for <b>helping</b>.</i></p>
<p>Учи такие глаголы сразу в паре: «enjoy doing», «decide to do».</p>`,
  mc: [["I enjoy ___ books.", "reading", "to read", "read", "reads"],
       ["She decided ___ the job.", "to take", "taking", "take", "took"],
       ["Thanks for ___ me.", "helping", "to help", "help", "helped"],
       ["Would you mind ___ the window?", "closing", "to close", "close", "closed"]],
  tr: [["Я люблю читать.", "I enjoy reading."], ["Он решил остаться.", "He decided to stay."], ["Спасибо, что помог.", "Thanks for helping."],
       ["Я хочу выучить английский.", "I want to learn English."], ["Перестань жаловаться.", "Stop complaining."], ["Я с нетерпением жду встречи.", "I look forward to meeting you."]] },
/* ---------------- B2 ---------------- */
{ id: "cond3", lvl: "B2", title: "Third Conditional — «если бы тогда»",
  rule: `<p>Нереальное прошлое, о чём сожалеем: <b>If + had + 3-я форма, would have + 3-я форма</b>.</p>
<p><i>If I <b>had known</b>, I <b>would have helped</b>.</i> — «Если бы я знал (тогда), я бы помог».</p>
<p>Смешанный: прошлое → настоящее: <i>If I had studied, I <b>would be</b> a doctor now.</i></p>`,
  mc: [["If I ___ known, I would have come.", "had", "have", "would have", "did"],
       ["If she had left earlier, she ___ the train.", "would have caught", "would catch", "had caught", "caught"],
       ["We would have won if we ___ harder.", "had tried", "tried", "would try", "have tried"],
       ["If I had taken the job, I ___ rich now.", "would be", "would have been", "will be", "had been"]],
  tr: [["Если бы я знал, я бы пришёл.", "If I had known, I would have come."], ["Если бы ты позвонил, я бы помог.", "If you had called, I would have helped."], ["Мы бы не опоздали, если бы вышли раньше.", "We wouldn't have been late if we had left earlier."],
       ["Если бы она училась, она бы сдала.", "If she had studied, she would have passed."], ["Что бы ты сделал на моём месте?", "What would you have done in my place?"], ["Если бы я тогда уехал, я бы сейчас жил в Лондоне.", "If I had left then, I would live in London now."]] },
{ id: "rep", lvl: "B2", title: "Косвенная речь: he said that…",
  rule: `<p>Пересказываем чужие слова — время <b>сдвигается на шаг назад</b>:</p>
<p>«I <b>am</b> tired» → He said (that) he <b>was</b> tired. «I <b>will</b> call» → She said she <b>would</b> call. «I <b>have</b> finished» → he said he <b>had</b> finished.</p>
<p>Вопросы — прямой порядок слов: <i>She asked where I <b>lived</b></i> (не «where did I live»). Да/нет вопрос — через <b>if</b>: <i>He asked if I was OK.</i></p>
<p><b>say</b> — без «кому», <b>tell</b> — обязательно кому: <i>He told <b>me</b> that…</i></p>`,
  mc: [["He said he ___ tired.", "was", "is", "be", "will"],
       ["She asked me where I ___.", "lived", "did live", "do live", "live did"],
       ["He ___ me that he was busy.", "told", "said", "spoke", "talked"],
       ["She said she ___ call me later.", "would", "will", "can", "shall"]],
  tr: [["Он сказал, что устал.", "He said that he was tired."], ["Она сказала мне, что позвонит.", "She told me that she would call."], ["Он спросил, где я живу.", "He asked where I lived."],
       ["Она спросила, всё ли у меня в порядке.", "She asked if I was OK."], ["Он сказал, что уже закончил.", "He said that he had already finished."], ["Я сказал ему не опаздывать.", "I told him not to be late."]] },
{ id: "ppc", lvl: "B2", title: "Present Perfect Continuous — давно делаю",
  rule: `<p>Действие началось в прошлом и <b>длится до сих пор</b> (или только что закончилось, видны следы): <i>I <b>have been waiting</b> for an hour!</i></p>
<p>Формула: <b>have / has been + -ing</b>.</p>
<p>Вопрос «как долго»: <i>How long <b>have</b> you <b>been learning</b> English?</i> — по-русски тут настоящее время, поэтому русские часто ошибаются: «How long do you learn» — неправильно.</p>`,
  mc: [["I ___ for you for an hour!", "have been waiting", "am waiting", "wait", "waited"],
       ["How long have you been ___ English?", "learning", "learn", "learned", "learnt"],
       ["She's tired because she ___ all day.", "has been working", "is working", "works", "work"],
       ["It ___ since morning.", "has been raining", "is raining", "rains", "rained"]],
  tr: [["Я жду тебя уже час.", "I have been waiting for you for an hour."], ["Как долго ты учишь английский?", "How long have you been learning English?"], ["Дождь идёт с утра.", "It has been raining since morning."],
       ["Она работает здесь три года.", "She has been working here for three years."], ["Чем ты занимался всё это время?", "What have you been doing all this time?"], ["Мы ищем квартиру уже месяц.", "We have been looking for a flat for a month."]] },
{ id: "deduct", lvl: "B2", title: "Must have / can't have — догадки о прошлом",
  rule: `<p>Уверены, что было: <b>must have + 3-я форма</b>: <i>He <b>must have forgotten</b>.</i> — «Он, должно быть, забыл».</p>
<p>Уверены, что не было: <b>can't have</b>: <i>She <b>can't have seen</b> us.</i></p>
<p>Возможно было: <b>might / could have</b>: <i>They might have missed the train.</i></p>
<p>Упрёк «надо было»: <b>should have</b>: <i>You <b>should have told</b> me!</i></p>`,
  mc: [["The lights are off. They ___ gone to bed.", "must have", "can't have", "should", "must"],
       ["She ___ seen me — she didn't say hello.", "can't have", "must have", "should have", "has"],
       ["You ___ told me earlier!", "should have", "must have", "can't have", "should"],
       ["He's late. He ___ missed the bus.", "might have", "can't have", "should have", "might"]],
  tr: [["Он, должно быть, забыл.", "He must have forgotten."], ["Ты должен был мне сказать!", "You should have told me!"], ["Она не могла этого сделать.", "She can't have done it."],
       ["Возможно, они опоздали на поезд.", "They might have missed the train."], ["Я не должен был это говорить.", "I shouldn't have said that."], ["Ты, наверное, устал.", "You must be tired."]] },
{ id: "wish", lvl: "B2", title: "I wish / If only — сожаления",
  rule: `<p>Жалеем о настоящем: <b>wish + Past Simple</b>: <i>I wish I <b>had</b> more time.</i> — «Жаль, что у меня мало времени».</p>
<p>Жалеем о прошлом: <b>wish + had + 3-я форма</b>: <i>I wish I <b>had studied</b> harder.</i></p>
<p>Раздражение чужим поведением: <b>wish + would</b>: <i>I wish you <b>would</b> stop talking.</i></p>`,
  mc: [["I wish I ___ taller.", "were", "am", "will be", "would be"],
       ["I wish I ___ that. I'm sorry.", "hadn't said", "didn't say", "don't say", "wouldn't say"],
       ["I wish you ___ stop shouting.", "would", "will", "had", "did"],
       ["If only I ___ more money now!", "had", "have", "had had", "will have"]],
  tr: [["Жаль, что у меня нет машины.", "I wish I had a car."], ["Жаль, что я не учился лучше.", "I wish I had studied harder."], ["Хоть бы ты перестал жаловаться.", "I wish you would stop complaining."],
       ["Жаль, что ты не здесь.", "I wish you were here."], ["Жаль, что я это сказал.", "I wish I hadn't said that."], ["Если бы только я знал!", "If only I had known!"]] },
{ id: "fut", lvl: "B2", title: "Future Continuous и Future Perfect",
  rule: `<p><b>will be + -ing</b> — буду в процессе в момент будущего: <i>This time tomorrow I <b>will be flying</b> to Rome.</i></p>
<p><b>will have + 3-я форма</b> — уже сделаю к моменту: <i>By 2027 I <b>will have learned</b> English.</i></p>
<p>Маркер Future Perfect — <b>by</b> (к): by Friday, by the time you arrive.</p>`,
  mc: [["This time tomorrow I ___ on the beach.", "will be lying", "will lie", "lie", "will have lain"],
       ["By Friday I ___ the report.", "will have finished", "will finish", "finish", "will be finishing"],
       ["Don't call at 8 — I ___ dinner.", "will be having", "will have had", "have", "had"],
       ["By the time you arrive, we ___ .", "will have left", "will leave", "leave", "are leaving"]],
  tr: [["Завтра в это время я буду лететь в Рим.", "This time tomorrow I will be flying to Rome."], ["К пятнице я закончу отчёт.", "By Friday I will have finished the report."], ["Я буду работать весь вечер.", "I will be working all evening."],
       ["К следующему году я выучу английский.", "By next year I will have learned English."], ["К тому времени, как ты приедешь, мы уже уйдём.", "By the time you arrive, we will have left."], ["Не звони в восемь, я буду ужинать.", "Don't call at eight, I will be having dinner."]] }
];

/* Дополнительные вопросы уровня C1 — только для теста уровня. */
const C1_TEST = [
  ["Not only ___ late, but he also forgot the tickets.", "was he", "he was", "he is", "did he"],
  ["Had I known, I ___ differently.", "would have acted", "would act", "acted", "had acted"],
  ["It's high time we ___ home.", "went", "go", "will go", "have gone"],
  ["Hardly ___ sat down when the phone rang.", "had I", "I had", "did I", "I have"],
  ["She insisted that he ___ present.", "be", "is", "was being", "will be"],
  ["I'd rather you ___ tell anyone.", "didn't", "don't", "won't", "not"],
  ["___ the bad weather, the event went ahead.", "Notwithstanding", "Although", "Even", "However"],
  ["The project, ___ funding was cut, was abandoned.", "whose", "which", "that", "who's"]
];

/* Фразы для проверки аудирования в тесте: от простой к сложной. */
const LISTEN_TEST = [
  { lvl: "A1", text: "My name is Anna and I live in a big city." },
  { lvl: "A2", text: "Yesterday I went to the shop and bought some bread." },
  { lvl: "B1", text: "If I had more free time, I would definitely learn to play the guitar." },
  { lvl: "B2", text: "Despite the considerable effort we put in, the outcome was rather disappointing." }
];

/* Тексты для чтения, аудирования и шэдоуинга. Пары «предложение | перевод». */
const TEXTS = [
{ id: "t1", lvl: "A1", title: "My day", pairs: [
  ["My name is Max.", "Меня зовут Макс."],
  ["I live in a small flat in the city centre.", "Я живу в маленькой квартире в центре города."],
  ["I get up at seven o'clock every day.", "Я встаю в семь часов каждый день."],
  ["I have coffee and toast for breakfast.", "На завтрак я пью кофе и ем тост."],
  ["Then I take the bus to work.", "Потом я еду на работу на автобусе."],
  ["I work in an office. My job is not very interesting, but my colleagues are nice.", "Я работаю в офисе. Работа не очень интересная, но коллеги приятные."],
  ["In the evening I watch films or play video games.", "Вечером я смотрю фильмы или играю в видеоигры."],
  ["I go to bed at midnight. That's my day!", "Я ложусь спать в полночь. Вот мой день!"]] },
{ id: "t2", lvl: "A1", title: "At the cafe", pairs: [
  ["— Hi! What can I get you?", "— Привет! Что вам предложить?"],
  ["— Can I have a large coffee, please?", "— Можно мне большой кофе, пожалуйста?"],
  ["— Sure. With milk?", "— Конечно. С молоком?"],
  ["— Yes, please. And a piece of chocolate cake.", "— Да, пожалуйста. И кусок шоколадного торта."],
  ["— Is that for here or to go?", "— Здесь или с собой?"],
  ["— For here, thanks. How much is it?", "— Здесь, спасибо. Сколько с меня?"],
  ["— That's six dollars fifty.", "— Шесть долларов пятьдесят."],
  ["— Can I pay by card?", "— Можно картой?"],
  ["— Of course. Have a nice day!", "— Конечно. Хорошего дня!"]] },
{ id: "t3", lvl: "A2", title: "A bad weekend", pairs: [
  ["Last weekend was terrible.", "Прошлые выходные были ужасными."],
  ["On Saturday morning my car broke down on the way to my parents' house.", "В субботу утром у меня сломалась машина по дороге к родителям."],
  ["I waited for two hours in the rain.", "Я два часа ждал под дождём."],
  ["When I finally arrived, everybody had already eaten.", "Когда я наконец приехал, все уже поели."],
  ["On Sunday I wanted to relax, but my neighbours were very noisy.", "В воскресенье я хотел отдохнуть, но соседи очень шумели."],
  ["In the evening I lost my phone.", "Вечером я потерял телефон."],
  ["I found it in the fridge the next morning!", "На следующее утро я нашёл его в холодильнике!"],
  ["I hope next weekend will be better.", "Надеюсь, следующие выходные будут лучше."]] },
{ id: "t4", lvl: "A2", title: "Job interview", pairs: [
  ["— Good morning. Please, have a seat.", "— Доброе утро. Присаживайтесь, пожалуйста."],
  ["— Thank you.", "— Спасибо."],
  ["— So, tell me a little about yourself.", "— Итак, расскажите немного о себе."],
  ["— I'm twenty-five. I studied economics and I have two years of experience in sales.", "— Мне двадцать пять. Я изучал экономику, у меня два года опыта в продажах."],
  ["— Why do you want to work for our company?", "— Почему вы хотите работать в нашей компании?"],
  ["— Because you are growing fast and I want to learn new skills.", "— Потому что вы быстро растёте, а я хочу освоить новые навыки."],
  ["— What is your biggest weakness?", "— Какая ваша главная слабость?"],
  ["— Sometimes I work too much and forget to rest.", "— Иногда я слишком много работаю и забываю отдыхать."],
  ["— Great. We'll call you next week.", "— Отлично. Мы позвоним вам на следующей неделе."]] },
{ id: "t5", lvl: "B1", title: "How I stopped procrastinating", pairs: [
  ["For years I used to put things off until the last minute.", "Годами я откладывал всё на последний момент."],
  ["I would open my laptop to work and end up watching videos for hours.", "Я открывал ноутбук, чтобы поработать, а в итоге часами смотрел видео."],
  ["Then a friend suggested a simple rule: just start for two minutes.", "Потом друг предложил простое правило: просто начни на две минуты."],
  ["It sounds stupid, but it actually works.", "Звучит глупо, но это действительно работает."],
  ["Once you have started, it's much easier to keep going.", "Когда уже начал, продолжать гораздо легче."],
  ["I also turned off notifications on my phone.", "Ещё я отключил уведомления на телефоне."],
  ["Now I manage to finish most of my tasks before lunch.", "Теперь я успеваю сделать большую часть задач до обеда."],
  ["I'm not perfect, but I've definitely improved.", "Я не идеален, но точно стал лучше."]] },
{ id: "t6", lvl: "B1", title: "Learning a language as an adult", pairs: [
  ["Many people believe that adults can't learn languages as well as children.", "Многие считают, что взрослые не могут учить языки так же хорошо, как дети."],
  ["Research shows that this is only partly true.", "Исследования показывают, что это правда лишь отчасти."],
  ["Children usually have a better accent, but adults learn grammar and vocabulary faster.", "У детей обычно лучше акцент, но взрослые быстрее учат грамматику и слова."],
  ["The main problem for adults is not their brain, but their lack of time and fear of mistakes.", "Главная проблема взрослых не мозг, а нехватка времени и страх ошибок."],
  ["If you practise a little every day, you will make progress.", "Если заниматься понемногу каждый день, прогресс будет."],
  ["Listening to real English and speaking without fear are the keys to success.", "Слушать живой английский и говорить без страха — ключи к успеху."],
  ["So stop making excuses and start today.", "Так что хватит оправдываться — начни сегодня."]] },
{ id: "t7", lvl: "B1", title: "A trip that went wrong", pairs: [
  ["Two years ago my girlfriend and I decided to go to Italy.", "Два года назад мы с девушкой решили поехать в Италию."],
  ["We had been planning the trip for months.", "Мы планировали поездку несколько месяцев."],
  ["When we arrived at the airport, we realised that her passport had expired.", "Когда мы приехали в аэропорт, оказалось, что у неё просрочен паспорт."],
  ["She couldn't get on the plane, so we had to go back home.", "Её не пустили в самолёт, и нам пришлось вернуться домой."],
  ["We were really upset, but we didn't give up.", "Мы очень расстроились, но не сдались."],
  ["A month later we finally went, and it was the best holiday of our lives.", "Через месяц мы всё-таки поехали, и это был лучший отпуск в нашей жизни."],
  ["Now we always check our documents twice.", "Теперь мы всегда дважды проверяем документы."]] },
{ id: "t8", lvl: "B2", title: "Remote work", pairs: [
  ["Remote work has become increasingly common over the past few years.", "За последние несколько лет удалённая работа стала всё более распространённой."],
  ["Supporters argue that it saves time and allows people to maintain a better work-life balance.", "Сторонники утверждают, что она экономит время и помогает соблюдать баланс между работой и жизнью."],
  ["Nevertheless, there are some significant drawbacks.", "Тем не менее у неё есть значительные недостатки."],
  ["Many employees report feeling isolated and find it hard to switch off at the end of the day.", "Многие сотрудники говорят, что чувствуют себя изолированными и им трудно отключиться в конце дня."],
  ["Companies, in turn, worry that team spirit and creativity may be undermined.", "Компании, в свою очередь, опасаются, что командный дух и креативность пострадают."],
  ["Ultimately, a hybrid model seems to be the most reasonable compromise.", "В конечном счёте гибридная модель кажется самым разумным компромиссом."],
  ["It combines flexibility with the benefits of face-to-face communication.", "Она сочетает гибкость с преимуществами живого общения."]] },
{ id: "t9", lvl: "B2", title: "Why we form habits", pairs: [
  ["Roughly forty percent of what we do every day is driven by habit rather than conscious decisions.", "Примерно сорок процентов того, что мы делаем каждый день, определяется привычкой, а не осознанными решениями."],
  ["Every habit follows the same loop: a cue, a routine and a reward.", "Каждая привычка работает по одной схеме: сигнал, действие и награда."],
  ["If you want to change a habit, you don't need to rely on willpower alone.", "Если хочешь изменить привычку, не нужно полагаться только на силу воли."],
  ["Instead, keep the cue and the reward, but replace the routine.", "Вместо этого сохрани сигнал и награду, но замени действие."],
  ["For example, if you reach for your phone whenever you feel bored, try reading a page of a book instead.", "Например, если ты тянешься к телефону, когда скучно, попробуй вместо этого прочитать страницу книги."],
  ["It may feel awkward at first, but after a few weeks the new routine becomes automatic.", "Сначала будет непривычно, но через несколько недель новое действие станет автоматическим."],
  ["That is exactly why daily practice beats occasional bursts of effort.", "Именно поэтому ежедневная практика лучше редких рывков."]] },
{ id: "t10", lvl: "B2", title: "If I had known", pairs: [
  ["Looking back, I wish I had started learning English much earlier.", "Оглядываясь назад, жалею, что не начал учить английский гораздо раньше."],
  ["Had I been able to speak it at university, I would have applied for an exchange programme.", "Если бы я говорил на нём в университете, я бы подал заявку на программу обмена."],
  ["I must have turned down at least three opportunities because I was too embarrassed to speak.", "Я, наверное, упустил минимум три возможности, потому что стеснялся говорить."],
  ["What I eventually realised is that nobody cares about your mistakes as much as you do.", "В конце концов я понял, что никого твои ошибки не волнуют так, как тебя."],
  ["People just want to understand you.", "Людям просто нужно тебя понять."],
  ["So if you are hesitating, don't wait for the perfect moment. It will never come.", "Так что если сомневаешься — не жди идеального момента. Он не наступит."]] },
{ id: "t11", lvl: "A1", title: "My family", pairs: [
  ["I have a small family.", "У меня небольшая семья."],
  ["My mother is a nurse and my father is a driver.", "Моя мама медсестра, а папа водитель."],
  ["I have one sister. Her name is Olga.", "У меня есть сестра. Её зовут Ольга."],
  ["She is twenty and she studies at university.", "Ей двадцать, она учится в университете."],
  ["We have a cat. It is black and very lazy.", "У нас есть кошка. Она чёрная и очень ленивая."],
  ["On Sundays we have lunch together.", "По воскресеньям мы обедаем вместе."],
  ["I love my family.", "Я люблю свою семью."]] },
{ id: "t12", lvl: "A1", title: "In a shop", pairs: [
  ["— Hello. Can I help you?", "— Здравствуйте. Вам помочь?"],
  ["— Yes, please. I'm looking for a black T-shirt.", "— Да, пожалуйста. Я ищу чёрную футболку."],
  ["— What size are you?", "— Какой у вас размер?"],
  ["— Medium, I think.", "— Думаю, M."],
  ["— Here you are. The changing room is over there.", "— Вот, пожалуйста. Примерочная вон там."],
  ["— Thanks. It's perfect. How much is it?", "— Спасибо. Идеально. Сколько стоит?"],
  ["— It's fifteen pounds.", "— Пятнадцать фунтов."],
  ["— Great, I'll take it.", "— Отлично, беру."]] },
{ id: "t13", lvl: "A2", title: "A phone call", pairs: [
  ["— Hi, Kate! It's Alex. Are you busy?", "— Привет, Кейт! Это Алекс. Ты занята?"],
  ["— No, not really. What's up?", "— Да нет. Что случилось?"],
  ["— Do you want to go to the cinema tonight?", "— Хочешь сходить в кино сегодня вечером?"],
  ["— I'd love to, but I have to work late.", "— С удовольствием бы, но мне надо задержаться на работе."],
  ["— What about tomorrow?", "— А завтра?"],
  ["— Tomorrow is fine. What time?", "— Завтра нормально. Во сколько?"],
  ["— The film starts at eight. Let's meet at half past seven.", "— Фильм начинается в восемь. Давай встретимся в половине восьмого."],
  ["— Sounds good. See you tomorrow!", "— Договорились. До завтра!"]] },
{ id: "t14", lvl: "A2", title: "Moving to a new city", pairs: [
  ["Last year I moved to Saint Petersburg for a new job.", "В прошлом году я переехал в Санкт-Петербург ради новой работы."],
  ["At first, everything was difficult.", "Сначала всё было трудно."],
  ["I didn't know anybody and I often got lost.", "Я никого не знал и часто терялся."],
  ["The weather was cold and it rained almost every day.", "Было холодно, и дождь шёл почти каждый день."],
  ["Then I joined a running club and made some friends.", "Потом я записался в беговой клуб и завёл друзей."],
  ["Now I know the city well and I love its old streets.", "Теперь я хорошо знаю город и люблю его старые улицы."],
  ["I'm happy that I decided to move.", "Я рад, что решился на переезд."]] },
{ id: "t15", lvl: "B1", title: "Saving money", pairs: [
  ["A few years ago I had a good salary, but I never had any money at the end of the month.", "Несколько лет назад у меня была хорошая зарплата, но в конце месяца денег никогда не оставалось."],
  ["I decided to find out where it was going.", "Я решил выяснить, куда они уходят."],
  ["For one month I wrote down everything I spent, even a cup of coffee.", "Месяц я записывал всё, что тратил, даже чашку кофе."],
  ["I was shocked: I was spending a fortune on taxis and food delivery.", "Я был в шоке: огромные деньги уходили на такси и доставку еды."],
  ["Now I cook at home, use public transport and put ten percent of my income into savings.", "Теперь я готовлю дома, езжу на общественном транспорте и откладываю десять процентов дохода."],
  ["It wasn't easy at first, but it's become a habit.", "Сначала было непросто, но это стало привычкой."],
  ["If you want to save money, start by tracking your spending.", "Если хочешь копить, начни с учёта расходов."]] },
{ id: "t16", lvl: "B1", title: "Sleep", pairs: [
  ["Most adults need between seven and nine hours of sleep a night.", "Большинству взрослых нужно от семи до девяти часов сна."],
  ["However, many people sleep much less because of work, stress or their phones.", "Однако многие спят гораздо меньше из-за работы, стресса или телефонов."],
  ["Lack of sleep affects your mood, your memory and even your weight.", "Недосып влияет на настроение, память и даже вес."],
  ["Interestingly, your brain uses sleep to store new information, including new words.", "Интересно, что во сне мозг сохраняет новую информацию, в том числе новые слова."],
  ["That's why reviewing vocabulary before bed can be very effective.", "Поэтому повторение слов перед сном бывает очень эффективным."],
  ["Try to go to bed at the same time every day and avoid screens for an hour before sleep.", "Старайся ложиться в одно и то же время и не смотреть в экраны за час до сна."]] },
{ id: "t17", lvl: "B1", title: "Asking for directions", pairs: [
  ["— Excuse me, could you tell me how to get to the train station?", "— Извините, не подскажете, как пройти к вокзалу?"],
  ["— Sure. Go straight ahead until you reach the traffic lights.", "— Конечно. Идите прямо до светофора."],
  ["— Then turn left and walk along the river for about five minutes.", "— Потом поверните налево и идите вдоль реки минут пять."],
  ["— You'll see a big shopping centre on your right. The station is just behind it.", "— Справа увидите большой торговый центр. Вокзал прямо за ним."],
  ["— Is it far? Should I take a bus?", "— Это далеко? Может, сесть на автобус?"],
  ["— No, it's a ten-minute walk. You can't miss it.", "— Нет, десять минут пешком. Не пропустите."],
  ["— Thank you so much!", "— Большое спасибо!"]] },
{ id: "t18", lvl: "B2", title: "AI at work", pairs: [
  ["Artificial intelligence is changing the way millions of people do their jobs.", "Искусственный интеллект меняет то, как работают миллионы людей."],
  ["Tasks that used to take hours, such as writing reports or analysing data, can now be done in minutes.", "Задачи, которые раньше занимали часы, например отчёты или анализ данных, теперь делаются за минуты."],
  ["Some experts warn that many jobs will disappear, while others argue that new ones will emerge.", "Одни эксперты предупреждают, что многие профессии исчезнут, другие утверждают, что появятся новые."],
  ["What seems certain is that the most valuable skills will be those machines can't easily replicate.", "Похоже, наверняка можно сказать одно: самыми ценными станут навыки, которые машинам трудно повторить."],
  ["Critical thinking, creativity and the ability to communicate across cultures are likely to be in high demand.", "Критическое мышление, креативность и умение общаться с людьми других культур, вероятно, будут востребованы."],
  ["Ironically, learning a foreign language may be more useful than ever.", "Как ни странно, знание иностранного языка может оказаться полезнее, чем когда-либо."]] },
{ id: "t19", lvl: "B2", title: "The four-day week", pairs: [
  ["Several companies have recently experimented with a four-day working week without cutting salaries.", "Несколько компаний недавно попробовали четырёхдневную рабочую неделю без снижения зарплат."],
  ["The results have been surprisingly positive.", "Результаты оказались на удивление положительными."],
  ["Employees reported lower levels of stress and burnout, and productivity in most cases remained the same or even increased.", "Сотрудники сообщали о меньшем стрессе и выгорании, а производительность в большинстве случаев осталась прежней или даже выросла."],
  ["Critics, however, point out that the model doesn't suit every industry.", "Критики, однако, отмечают, что эта модель подходит не всем отраслям."],
  ["Hospitals, schools and shops can't simply close for an extra day.", "Больницы, школы и магазины не могут просто закрыться ещё на один день."],
  ["Whether the idea spreads will depend on how creatively businesses adapt.", "Распространится ли идея, зависит от того, насколько изобретательно бизнес приспособится."]] },
{ id: "t20", lvl: "B2", title: "Your attention is the product", pairs: [
  ["Have you ever opened an app for a minute and looked up an hour later?", "Бывало, что открыл приложение на минуту, а очнулся через час?"],
  ["That's not an accident: many apps are deliberately designed to keep you scrolling.", "Это не случайность: многие приложения специально сделаны так, чтобы ты продолжал листать."],
  ["Infinite feeds, notifications and likes all exploit the way our brains respond to unpredictable rewards.", "Бесконечные ленты, уведомления и лайки используют то, как мозг реагирует на непредсказуемые награды."],
  ["The longer you stay, the more adverts you see, and the more money the company makes.", "Чем дольше ты сидишь, тем больше рекламы видишь и тем больше зарабатывает компания."],
  ["Being aware of this doesn't make you immune, but it helps.", "Понимание этого не даёт иммунитета, но помогает."],
  ["Turning off non-essential notifications is a simple first step towards taking back control of your time.", "Отключить ненужные уведомления — простой первый шаг к тому, чтобы вернуть контроль над своим временем."]] }
];

/* Темы для говорения. Цель — 1–2 минуты речи, используя подсказанные фразы. */
const SPEAK = {
  A1: [["Расскажи о себе", "My name is… I live in… I like…"],
       ["Опиши свою комнату", "There is… There are… My room is…"],
       ["Твой обычный день", "I usually… Then I… In the evening I…"],
       ["Твоя семья", "I have… My mother is… We often…"],
       ["Что ты любишь есть", "I like… I don't like… My favourite food is…"],
       ["Твой город", "My city is… There are… I like it because…"]],
  A2: [["Последние выходные", "Last weekend I… Then I… It was…"],
       ["Планы на лето", "I'm going to… I hope… Maybe I will…"],
       ["Лучшая поездка", "Two years ago I went to… We visited… It was the best…"],
       ["Твоя работа или учёба", "I work as… I have to… I like / don't like…"],
       ["Сравни два города", "… is bigger than… The best thing about… is…"],
       ["Что ты уже делал в жизни", "I have been to… I have never… I've already…"]],
  B1: [["Если бы у тебя был миллион", "If I had a million, I would… I'd also…"],
       ["Что ты раньше делал, а теперь нет", "I used to… but now I… I'm used to…"],
       ["Плюсы и минусы соцсетей", "On the one hand… On the other hand… In my opinion…"],
       ["Совет другу, который хочет выучить английский", "You should… If you… it will… Try to…"],
       ["Случай, когда всё пошло не так", "I was …-ing when… Suddenly… In the end…"],
       ["Твоя цель на год", "I'm going to… I hope to achieve… To do that, I need to…"]],
  B2: [["О чём ты жалеешь", "I wish I had… If I had…, I would have… Looking back…"],
       ["Удалёнка или офис", "Supporters argue that… Nevertheless… Ultimately…"],
       ["Каким будет мир через 20 лет", "By 2045, we will have… People will be…-ing… It's likely that…"],
       ["Расскажи новость в косвенной речи", "They said that… Apparently… It turned out that…"],
       ["Важное решение в жизни", "It must have been… I should have… It turned out…"],
       ["Привычка, которую ты хочешь изменить", "I've been trying to… The main obstacle is… I'm going to replace…"]]
};

/* Методики, на которых построено приложение. */
const METHODS = [
  ["🧠", "Интервальные повторения (SRS)", "Слово показывается ровно перед тем, как ты его забудешь: через день, 3 дня, неделю, месяц. Так запоминается в 5–10 раз больше слов за то же время, чем зубрёжкой списков. Это кривая забывания Эббингауза, превращённая в расписание."],
  ["🎯", "Активное припоминание", "Не перечитываешь, а вытаскиваешь из памяти: видишь перевод — сам набираешь слово. Усилие вспомнить и есть то, что закрепляет память. Поэтому здесь много набора с клавиатуры, а не только «узнал / не узнал»."],
  ["🔁", "Вспоминать английское по русскому", "Самое полезное направление: видишь «надёжный» — сам вспоминаешь reliable. Узнать слово легко, а вот достать его из памяти, когда нужно сказать, — это и есть активный словарь. В повторении такие карточки идут вперемешку с обычными."],
  ["🎬", "Слово в ситуации", "Слово проверяется внутри фразы из примера: видишь предложение с пропуском и ситуацию по-русски — вставляешь нужное слово в правильной форме. Так запоминается не только значение, но и как слово используется."],
  ["📊", "Частотность (правило 80/20)", "2000 самых частых слов покрывают около 80–90% обычной речи. Начинаем с них, редкие слова — потом. Словарь в приложении отсортирован по частотности."],
  ["🧩", "Чанки — учим фразами", "Носители говорят готовыми блоками: «It depends», «I'm about to», «It turns out that». Выученный блок вылетает без перевода в голове, поэтому каждое слово идёт с примером, а фразы — отдельной колодой."],
  ["🎧", "Понятный ввод (i+1)", "Язык усваивается, когда слушаешь и читаешь то, что понятно на 90%, и чуть-чуть сверху. Тексты подобраны по уровням, перевод каждого слова — по тапу."],
  ["🗣", "Шэдоуинг", "Слушаешь фразу и повторяешь вслух сразу за диктором, копируя интонацию и ритм. Ставит произношение и разгоняет беглость. Микрофон проверяет, что ты сказал."],
  ["✍️", "Диктант", "Слушаешь и пишешь. Заставляет мозг разбирать каждое слово на слух, а не угадывать смысл. Лучший тренажёр для понимания быстрой речи."],
  ["🔀", "Перемешивание (interleaving)", "Повторяя старые темы вперемешку с новыми, ты учишься выбирать правильную форму, а не на автомате ставить ту, что учил 5 минут назад."],
  ["💬", "Вывод (output)", "Пока не говоришь — не заговоришь. Каждый день 1–2 минуты речи на тему с опорными фразами. Ошибки — это нормально, молчание — нет."],
  ["⏱", "Каждый день, коротко", "45–90 минут каждый день лучше, чем 5 часов в субботу. Серия дней и дневная цель держат ритм, а не мотивация."],
  ["🌊", "Погружение", "Сериалы, подкасты, YouTube на английском в свободное время — это часы, которых не хватит в приложении. Отмечай их в «Погружении» — они идут в прогресс."]
];

/* Реплики тренера. Жёсткий режим — для тех, кого надо пинать. */
const COACH = {
  hard: {
    idle: ["Сам себя английский не выучит. Жми «Начать».", "Каждый пропущенный день — минус к твоим полгода. Погнали.", "Хватит листать ленту. 45 минут — и свободен.", "Носители не умнее тебя. Они просто практиковались. Твоя очередь.", "Ты скачал приложение не для того, чтобы на него смотреть."],
    done: ["Норм. Завтра так же — и через полгода заговоришь.", "Вот так. Один день из ста восьмидесяти закрыт.", "Сделал — молодец. Серию не рви.", "Неплохо. Хочешь быстрее — открой сериал на английском."],
    streakLost: ["Серия сгорела. Неприятно? Тогда не пропускай.", "Пропустил. Бывает. Но второй раз подряд — это уже привычка ничего не делать."],
    wrong: ["Мимо. Запомни и дальше.", "Нет. Посмотри внимательно.", "Ошибка — это нормально. Повторять её — нет."],
    right: ["Да.", "Верно.", "Чётко.", "Вот так."]
  },
  soft: {
    idle: ["Начнём? Сегодняшний план уже готов.", "Немного каждый день — и результат придёт.", "Пара минут — и ты уже ближе к цели."],
    done: ["Отличная работа! До завтра.", "План на сегодня выполнен. Горжусь!", "Супер! Ещё один шаг вперёд."],
    streakLost: ["Серия прервалась, но ничего страшного. Начнём заново!"],
    wrong: ["Почти! Посмотри правильный ответ.", "Не страшно, в следующий раз получится."],
    right: ["Отлично!", "Верно!", "Супер!", "Так держать!"]
  }
};

/* Что умеет человек на каждом уровне — простыми словами. */
const LEVELS = {
  A0: { name: "A0 · Ноль", can: "Пока почти ничего — и это нормально. Начнём с самых частых слов и простейших фраз.", hours: 0 },
  A1: { name: "A1 · Начальный", can: "Можешь представиться, заказать кофе, понять простые фразы, если говорят медленно.", hours: 90 },
  A2: { name: "A2 · Элементарный", can: "Объяснишься в магазине, в отеле, в поездке. Рассказываешь о себе и прошлом простыми фразами.", hours: 200 },
  B1: { name: "B1 · Средний", can: "Свободно в бытовых темах, понимаешь основное в сериалах с субтитрами, можешь работать с иностранцами на простом уровне.", hours: 400 },
  B2: { name: "B2 · Выше среднего", can: "Спокойно говоришь с носителями, смотришь сериалы, проходишь собеседования, работаешь на английском.", hours: 600 },
  C1: { name: "C1 · Продвинутый", can: "Почти как на родном: нюансы, юмор, сложные тексты, профессиональное общение.", hours: 800 }
};

/* Материалы для погружения. Ссылки на YouTube ведут на поиск по каналу —
   так они не ломаются, если канал сменит адрес. */
const YT = q => "https://www.youtube.com/results?search_query=" + encodeURIComponent(q);
const IMDB = q => "https://www.imdb.com/find/?q=" + encodeURIComponent(q);
const MEDIA = [
  /* ---- сериалы ---- */
  { k: "series", lvl: "A2", title: "Extr@ English", desc: "Ситком, снятый специально для изучающих английский: медленная чёткая речь, простые бытовые ситуации.", how: "Первый сериал для A1–A2. Смотри с английскими субтитрами, серии по 25 минут.", url: YT("Extra English episode 1") },
  { k: "series", lvl: "A2", title: "Peppa Pig", desc: "Мультфильм для детей, но идеален для старта: короткие серии, простые фразы, британский акцент.", how: "Серия 5 минут — посмотри 3 раза: с субтитрами, без, и повторяя за героями.", url: YT("Peppa Pig full episodes English") },
  { k: "series", lvl: "B1", title: "Friends («Друзья»)", desc: "Классика для изучающих: бытовой разговорный английский, повторяющиеся шутки и фразы.", how: "Смотри серию с английскими субтитрами, выписывай 3–5 фраз и добавляй их в «Слова».", url: IMDB("Friends 1994") },
  { k: "series", lvl: "B1", title: "Modern Family («Американская семейка»)", desc: "Семейная комедия: современный американский английский, короткие сцены, много повседневной лексики.", how: "Серии по 20 минут — удобно смотреть по одной в день.", url: IMDB("Modern Family") },
  { k: "series", lvl: "B1", title: "How I Met Your Mother («Как я встретил вашу маму»)", desc: "Разговорный английский, сленг, отношения, работа. Много чанков, которые реально используют.", how: "Если сложно — сначала с английскими субтитрами, потом пересмотри любимую серию без них.", url: IMDB("How I Met Your Mother") },
  { k: "series", lvl: "B1", title: "Brooklyn Nine-Nine («Бруклин 9-9»)", desc: "Полицейская комедия: живые диалоги, понятная речь, короткие серии.", how: "Хорош для шэдоуинга: повторяй короткие реплики за персонажами.", url: IMDB("Brooklyn Nine-Nine") },
  { k: "series", lvl: "B1", title: "Stranger Things («Очень странные дела»)", desc: "Затягивает — значит, смотришь много часов. Простая речь подростков.", how: "Главное здесь — объём: досматривай сезоны, не останавливаясь на каждом слове.", url: IMDB("Stranger Things") },
  { k: "series", lvl: "B1", title: "Ted Lasso («Тед Лассо»)", desc: "Американец тренирует британскую футбольную команду: два акцента сразу и очень добрый юмор.", how: "Сравнивай, как одно и то же говорят американцы и британцы.", url: IMDB("Ted Lasso") },
  { k: "series", lvl: "B2", title: "The Office (US) («Офис»)", desc: "Офисная жизнь, рабочая лексика, неловкий юмор, естественная речь с паузами и оговорками.", how: "Отличный источник фраз для работы и созвонов.", url: IMDB("The Office US") },
  { k: "series", lvl: "B2", title: "Suits («Форс-мажоры»)", desc: "Юристы, переговоры, деловой английский. Речь быстрая, но чёткая.", how: "Выписывай фразы из переговоров — пригодятся на собеседованиях.", url: IMDB("Suits 2011") },
  { k: "series", lvl: "B2", title: "Sherlock («Шерлок»)", desc: "Британский английский, быстрая и умная речь, богатый словарь.", how: "Смотри с английскими субтитрами — без них сложно даже носителям.", url: IMDB("Sherlock 2010") },
  { k: "series", lvl: "B2", title: "Breaking Bad («Во все тяжкие»)", desc: "Захватывающий сюжет, разнообразная речь — от учителя до бандитов.", how: "Не переводи каждое слово: цель — понимать сюжет на 80% и смотреть много.", url: IMDB("Breaking Bad") },
  { k: "series", lvl: "B2", title: "Black Mirror («Чёрное зеркало»)", desc: "Отдельные истории о технологиях: британский английский, серьёзная лексика.", how: "Каждая серия — отдельная история, можно смотреть в любом порядке.", url: IMDB("Black Mirror") },
  { k: "series", lvl: "C1", title: "Downton Abbey («Аббатство Даунтон»)", desc: "Британская аристократия начала XX века: формальный английский и разные акценты.", how: "Для B2+: уровень вежливости и оборотов здесь сильно выше обычного.", url: IMDB("Downton Abbey") },
  /* ---- YouTube ---- */
  { k: "yt", lvl: "A1", title: "BBC Learning English", desc: "Официальный канал BBC: короткие уроки грамматики, лексики и произношения для всех уровней.", how: "Подпишись и смотри по одному ролику в день за завтраком.", url: YT("BBC Learning English") },
  { k: "yt", lvl: "A2", title: "English with Lucy", desc: "Британская учительница: грамматика, произношение, лексика, всё очень понятно.", how: "Ищи ролики по темам, которые проходишь в разделе «Грамматика».", url: YT("English with Lucy") },
  { k: "yt", lvl: "A2", title: "Speak English With Vanessa", desc: "Американский английский, разговорные фразы, медленная чёткая речь.", how: "Повторяй примеры вслух — это готовый шэдоуинг.", url: YT("Speak English With Vanessa") },
  { k: "yt", lvl: "B1", title: "Easy English (уличные интервью)", desc: "Интервью с обычными людьми на улице, с двойными субтитрами. Живая речь носителей.", how: "Смотри один ролик 2–3 раза: с субтитрами, без, и с паузами для повтора.", url: YT("Easy English street interviews") },
  { k: "yt", lvl: "B1", title: "Learn English with TV Series", desc: "Разбирает сцены из сериалов и фильмов: сленг, фразы, произношение.", how: "Сначала посмотри разбор, потом саму сцену без субтитров.", url: YT("Learn English with TV Series") },
  { k: "yt", lvl: "B1", title: "Rachel's English", desc: "Лучший канал про американское произношение: связная речь, ударения, редукции.", how: "Для шэдоуинга: повторяй фразу за Рейчел, записывай себя и сравнивай.", url: YT("Rachel's English") },
  { k: "yt", lvl: "B2", title: "TED-Ed", desc: "Короткие анимированные ролики о науке и истории с чёткой речью и субтитрами.", how: "Ролик 5 минут: сначала без субтитров, потом проверь, что понял.", url: YT("TED-Ed") },
  { k: "yt", lvl: "B2", title: "Kurzgesagt — In a Nutshell", desc: "Научно-популярная анимация: космос, биология, общество. Богатая лексика B2–C1.", how: "Слушай фоном второй раз — лексика начинает узнаваться.", url: YT("Kurzgesagt In a Nutshell") },
  /* ---- подкасты ---- */
  { k: "pod", lvl: "A2", title: "6 Minute English (BBC)", desc: "6 минут, два ведущих, одна тема и разбор слов. Есть расшифровка каждого выпуска.", how: "Идеально в дорогу: один выпуск в день, потом прочитай расшифровку.", url: "https://www.bbc.co.uk/learningenglish/english/features/6-minute-english" },
  { k: "pod", lvl: "B1", title: "The English We Speak (BBC)", desc: "3-минутные выпуски про одно разговорное выражение или идиому.", how: "Каждое выражение — сразу в «Слова» как своё.", url: "https://www.bbc.co.uk/learningenglish/english/features/the-english-we-speak" },
  { k: "pod", lvl: "A2", title: "VOA Learning English", desc: "Новости и истории на медленном английском (около 2/3 обычной скорости) с текстом.", how: "Слушай и читай текст одновременно — так ухо привыкает быстрее.", url: "https://learningenglish.voanews.com" },
  { k: "pod", lvl: "B2", title: "Luke's English Podcast", desc: "Британский учитель болтает о жизни, культуре и языке. Длинные выпуски, живая речь.", how: "Для B2: слушай на прогулке или в спортзале, не останавливаясь.", url: "https://teacherluke.co.uk" },
  { k: "pod", lvl: "B1", title: "All Ears English", desc: "Американский разговорный английский: фразы для общения, small talk, работа.", how: "Выписывай фразы для small talk и используй их в «Говорении».", url: "https://www.allearsenglish.com" },
  /* ---- сайты и инструменты ---- */
  { k: "site", lvl: "A1", title: "British Council LearnEnglish", desc: "Бесплатные уроки от British Council: грамматика, чтение, аудирование, с упражнениями.", how: "Раздел Grammar дополняет темы из приложения упражнениями.", url: "https://learnenglish.britishcouncil.org" },
  { k: "site", lvl: "A2", title: "News in Levels", desc: "Одна новость в трёх уровнях сложности, с аудио.", how: "Читай уровень 2, потом уровень 3 той же новости.", url: "https://www.newsinlevels.com" },
  { k: "site", lvl: "B1", title: "Breaking News English", desc: "Свежие новости, адаптированные под 7 уровней, с аудио и упражнениями.", how: "Выбирай уровень 3–5, слушай и делай диктант.", url: "https://breakingnewsenglish.com" },
  { k: "site", lvl: "A2", title: "LyricsTraining", desc: "Учишь английский по песням: клип играет, а ты вписываешь пропущенные слова.", how: "Отличный «ленивый» вариант на вечер — тоже считается погружением.", url: "https://lyricstraining.com" },
  { k: "site", lvl: "A1", title: "Perfect English Grammar", desc: "Понятные объяснения грамматики и сотни упражнений с ответами.", how: "Не понял тему в приложении — открой её здесь.", url: "https://www.perfect-english-grammar.com" },
  { k: "site", lvl: "B1", title: "YouGlish", desc: "Вводишь слово или фразу — показывает, как её произносят носители в тысячах роликов.", how: "Сомневаешься в произношении слова — проверь тут за 10 секунд.", url: "https://youglish.com" },
  { k: "site", lvl: "B1", title: "Language Reactor", desc: "Расширение для Chrome: двойные субтитры (англ + рус) на Netflix и YouTube, перевод по наведению.", how: "Самый удобный способ смотреть сериалы на английском с компьютера.", url: "https://www.languagereactor.com" },
  { k: "site", lvl: "A1", title: "Cambridge Dictionary", desc: "Лучший онлайн-словарь: значения, примеры, произношение UK и US, перевод на русский.", how: "Ищи слова здесь, а не в автопереводчике — увидишь примеры.", url: "https://dictionary.cambridge.org/dictionary/english-russian/" },
  /* ---- книги ---- */
  { k: "book", lvl: "A1", title: "Murphy — Essential Grammar in Use (красный)", desc: "Самый известный учебник грамматики для A1–A2: слева правило, справа упражнения.", how: "Один юнит в день вместе с темой из приложения.", url: "" },
  { k: "book", lvl: "B1", title: "Murphy — English Grammar in Use (синий)", desc: "Тот же формат для B1–B2. Стандарт для самостоятельного изучения.", how: "Делай юниты по темам, где ошибаешься в тренировках.", url: "" },
  { k: "book", lvl: "A2", title: "Адаптированные книги: Penguin Readers, Oxford Bookworms", desc: "Известные истории, упрощённые под уровень. Книга целиком — лучший понятный ввод.", how: "Бери уровень, где понятно 90% слов. Читай по 15–20 минут в день, не переводя каждое слово.", url: "" },
  { k: "book", lvl: "B1", title: "McCarthy, O'Dell — English Vocabulary in Use", desc: "Лексика по темам с упражнениями, уровни от Elementary до Advanced.", how: "Слова из книги — в «Слова» через импорт списка.", url: "" }
];
const MEDIA_KINDS = { series: "🎬 Сериалы", yt: "▶️ YouTube", pod: "🎧 Подкасты", site: "🌐 Сайты", book: "📚 Книги" };
