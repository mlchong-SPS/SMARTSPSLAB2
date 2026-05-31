/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question, SPS_Skill, Difficulty, TranslationObj, Mission, LeaderboardEntry, Badge } from '../types';

// Let's create an list of plants, animals, and substances to use in dynamic templating
interface ScienceEntity {
  en: string;
  ms: string;
  zh: string;
}

const VEGETATION: ScienceEntity[] = [
  { en: 'Balsam plant', ms: 'Pokok keembung', zh: '凤仙花' },
  { en: 'Hibiscus plant', ms: 'Pokok bunga raya', zh: '大红花植物' },
  { en: 'Cactus plant', ms: 'Pokok kaktus', zh: '仙人掌植物' },
  { en: 'Maize seedling', ms: 'Anak benih jagung', zh: '玉米幼苗' },
  { en: 'Bean plant', ms: 'Pokok kacang', zh: '豆类植物' }
];

const ANIMALS: ScienceEntity[] = [
  { en: 'Caterpillars', ms: 'Beluncas', zh: '毛毛虫' },
  { en: 'Grasshoppers', ms: 'Belalang', zh: '蚂蚱' },
  { en: 'Guppy fish', ms: 'Ikan gupi', zh: '孔雀鱼' },
  { en: 'Snails', ms: 'Siput', zh: '蜗牛' },
  { en: 'White mice', ms: 'Mencit putih', zh: '小白鼠' }
];

const SUBSTANCES: ScienceEntity[] = [
  { en: 'Lemon juice (Acidic)', ms: 'Jus lemon (Asid)', zh: '柠檬汁（酸性）' },
  { en: 'Lime water (Alkaline)', ms: 'Air kapur (Alkali)', zh: '石灰水（碱性）' },
  { en: 'Distilled water (Neutral)', ms: 'Air suling (Neutral)', zh: '蒸馏水（中性）' },
  { en: 'Salt solution (Neutral)', ms: 'Larutan garam (Neutral)', zh: '盐水（中性）' },
  { en: 'Vinegar liquid (Acidic)', ms: 'Cecair cuka (Asid)', zh: '醋液（酸性）' }
];

// Helper to make translations quickly
function createTrans(en: string, ms: string, zh: string): TranslationObj {
  return { en, ms, zh };
}

/**
 * Procedurally generates 15 questions for a specific SPS skill.
 * We use 3 baseline structural templates (Easy, Medium, Advanced) and parameterize them
 * to construct 15 highly distinct, grammatically correct, and scientifically solid questions.
 */
export function generateQuestionsForSkill(skill: SPS_Skill): Question[] {
  const list: Question[] = [];

  for (let i = 0; i < 15; i++) {
    const id = `${skill}_q_${i + 1}`;
    const diff: Difficulty = i < 5 ? 'easy' : i < 10 ? 'medium' : 'advanced';
    
    // Choose dynamic entities using deterministic modulo indexing
    const pIndex = i % VEGETATION.length;
    const aIndex = (i + 2) % ANIMALS.length;
    const sIndex = (i + 4) % SUBSTANCES.length;

    const veg = VEGETATION[pIndex];
    const anim = ANIMALS[aIndex];
    const sub = SUBSTANCES[sIndex];

    const val1 = 10 + (i * 5);
    const val2 = 30 + (i * 15);
    const val3 = val1 + val2;

    switch (skill) {
      case 'observation': {
        if (diff === 'easy') {
          if (i === 0) {
            list.push({
              id,
              skill,
              difficulty: diff,
              scenario: createTrans(
                `An experiment is carried out to study the growth of two identical ${veg.en}s. Plant X is placed under direct sunlight and watered daily. Plant Y is kept inside a dark cupboard and is not watered. After 10 days, Plant X is healthy and green, while Plant Y is wilted and yellow.`,
                `Satu eksperimen dijalankan untuk mengkaji pertumbuhan dua pokok ${veg.ms} yang serupa. Pokok X diletakkan di bawah cahaya matahari langsung dan disiram setiap hari. Pokok Y disimpan di dalam almari gelap dan tidak disiram. Selepas 10 hari, Pokok X adalah sihat dan hijau, manakala Pokok Y layu dan kuning.`,
                `进行了一项实验以研究两株相同${veg.zh}的生长情况。植物 X 放在阳光直射下并每天浇水。植物 Y 放在黑暗的橱柜里，不浇水。10天后，植物 X 健康翠绿，而植物 Y 枯萎发黄。`
              ),
              questionText: createTrans(
                `Based on this experiment, what is the most accurate observation regarding Plant Y?`,
                `Sadar kepada eksperimen ini, apakah pemerhatian yang paling tepat bagi Pokok Y?`,
                `根据这项实验，关于植物 Y 最准确的观察是什么？`
              ),
              options: [
                createTrans(`Plant Y was not given minerals.`, `Pokok Y tidak diberikan mineral.`, `植物 Y 没有获得矿物质。`),
                createTrans(`Plant Y needs sunlight to grow.`, `Pokok Y memerlukan cahaya matahari untuk bertumbuh.`, `植物 Y 需要阳光才能生长。`),
                createTrans(`Plant Y is wilted and turned yellow.`, `Pokok Y layu dan berwarna kuning.`, `植物 Y 枯萎并变黄。`),
                createTrans(`Plant Y died because it ran out of glucose.`, `Pokok Y mati kerana kehabisan glukosa.`, `植物 Y 死亡是因为它消耗完了葡萄糖。`)
              ],
              correctIndex: 2,
              explanation: createTrans(
                `Observation only records what can be measured or sensed. 'Wilted and yellow' is a direct visual observation, whereas explanations like needing sunlight are inferences.`,
                `Pemerhatian hanya merekodkan apa yang boleh diukur atau dikesan oleh deria. 'Layu dan berwarna kuning' ialah pemerhatian visual secara langsung, manakala penjelasan seperti memerlukan cahaya matahari ialah inferens.`,
                `观察只记录可以测量或感官感知的事物。“枯萎并发黄”是直接的视觉观察，而“需要阳光才能生长”等解释则是推断。`
              )
            });
          } else if (i === 1) {
            list.push({
              id,
              skill,
              difficulty: diff,
              scenario: createTrans(
                `A student tests a strong bar magnet with three items made of different materials: an iron nail, a plastic ruler, and a rubber eraser. The student records that the iron nail is pulled instantly to the magnet, while the plastic ruler and rubber eraser do not move.`,
                `Seorang murid menguji magnet bar yang kuat dengan tiga objek daripada bahan berbeza: paku besi, pembaris plastik, dan pemadam getah. Murid tersebut merekodkan bahawa paku besi ditarik serta-merta ke arah magnet, manakala pembaris plastik dan pemadam getah tidak bergerak.`,
                `一名学生用三种不同材质的物品测试强力条形磁铁：铁钉、塑料尺和橡胶橡皮擦。学生记录到铁钉瞬间被吸向磁铁，而塑料尺和橡胶橡皮擦保持静止不动。`
              ),
              questionText: createTrans(
                `What is the most accurate scientific observation that can be recorded from this test?`,
                `Apakah pemerhatian saintifik paling tepat yang boleh direkodkan daripada ujian ini?`,
                `从此测试中可以记录的最准确科学观察是什么？`
              ),
              options: [
                createTrans(`The magnet attracts only the iron nail.`, `Magnet hanya menarik paku besi sahaja.`, `磁铁只吸引铁钉。`),
                createTrans(`The plastic ruler has magnetic repulsion fields.`, `Pembaris plastik mempunyai medan tolakan magnet.`, `塑料尺具有磁场排斥力。`),
                createTrans(`The iron nail became a temporary electromagnet.`, `Paku besi telah menjadi elektromagnet sementara.`, `铁钉变成了临时电磁铁。`),
                createTrans(`All metal objects in the room are highly magnetic.`, `Semua objek logam di dalam bilik adalah sangat bermagnet.`, `房间里的所有金属物体都具有强磁性。`)
              ],
              correctIndex: 0,
              explanation: createTrans(
                `An observation is a direct detection of events using the senses. We saw that only the iron nail moved toward the magnet, while other items stayed still. Speculating on magnetic fields or electromagnets is an inference.`,
                `Pemerhatian ialah pengesanan langsung kejadian menggunakan deria. Kita melihat hanya paku besi bergerak ke arah magnet, manakala barang-barang lain kekal pegun. Membuat spekulasi mengenai medan magnet adalah inferens.`,
                `观察是用感官对事件的直接检测。我们看到只有铁钉向磁铁移动，而其他物品保持静止。推测磁场或电磁铁则是一种推断。`
              )
            });
          } else if (i === 2) {
            list.push({
              id,
              skill,
              difficulty: diff,
              scenario: createTrans(
                `A spoonful of white sugar is added to Beaker A containing water and stirred. A spoonful of fine brown sand is added to Beaker B containing water and stirred. The sugar disappears completely into a clear liquid, while the brown sand settles entirely at the bottom of Beaker B.`,
                `Satu sudu gula putih dimasukkan ke dalam Bikar A yang mengandungi air dan dikacau. Satu sudu pasir halus berwarna coklat dimasukkan ke dalam Bikar B yang mengandungi air dan dikacau. Gula tersebut hilang sepenuhnya dalam cecair jernih, manakala pasir coklat mendap sepenuhnya di dasar Bikar B.`,
                `在含有水的烧杯 A 中加入一勺白糖并搅拌。在含有水的烧杯 B 中加入一勺细褐沙并搅拌。糖完全消失在清澈的液体中，而细褐沙则完全沉淀在烧杯 B 的底部。`
              ),
              questionText: createTrans(
                `What is the correct factual observation regarding Beaker B?`,
                `Apakah pemerhatian fakta yang betul mengenai Bikar B?`,
                `关于烧杯 B，以下哪项是正确的客观事实观察？`
              ),
              options: [
                createTrans(`The brown sand does not dissolve and settles at the bottom.`, `Pasir coklat tidak melarut dan mendap di dasar bikar.`, `细褐沙未溶解并沉淀在杯底。`),
                createTrans(`Water molecules cannot break down the sand structure.`, `Molekul air tidak dapat memecahkan struktur pasir.`, `水分子的键结无法分解沙子的物理结构。`),
                createTrans(`Beaker B has a higher chemical temperature than Beaker A.`, `Bikar B mempunyai suhu kimia yang lebih tinggi daripada Bikar A.`, `烧杯 B 的化学温度高于烧杯 A。`),
                createTrans(`Fine sand particles are sweet while sugar crystals are bitter.`, `Zarah pasir halus adalah manis manakala hablur gula adalah pahit.`, `沙子颗粒味道是甜的，而白糖则是苦的。`)
              ],
              correctIndex: 0,
              explanation: createTrans(
                `A scientific observation describes what is directly visible: the brown sand settles at the bottom of Bikar B. Describing molecular dissolution is an inference/explanation, not a direct observation.`,
                `Pemerhatian saintifik menerangkan apa yang kelihatan secara langsung: pasir coklat mendap di dasar Bikar B. Menerangkan pelarutan molekul ialah inferens, bukan pemerhatian langsung.`,
                `科学观察描述了直接可见的情况：细褐沙沉淀在烧杯 B 的底部。描述分子层面的溶解是推论/解释，而不是直接。`
              )
            });
          } else if (i === 3) {
            list.push({
              id,
              skill,
              difficulty: diff,
              scenario: createTrans(
                `A plastic bottle with an empty uninflated balloon stretched tightly over its neck is placed inside a bowl filled with extremely hot water. Within 45 seconds, the balloon inflates and stands upright. When the bottle is moved to a bowl of ice water, the balloon shrinks and deflates.`,
                `Sebuah botol plastik dengan belon kosong yang tidak ditiup diregangkan ketat pada muncungnya diletakkan di dalam mangkuk berisi air yang sangat panas. Dalam masa 45 saat, belon tersebut mengembung dan berdiri tegak. Apabila botol dipindahkan ke mangkuk berisi air ais, belon mengecut dan kempis.`,
                `一个塑料瓶，其瓶口紧紧套着一个未充气的空气球，被放入装有极热水脑碗中。在 45 秒内，气球膨胀并竖立起来。当将瓶子移到冰水碗中时，气球收缩并放气。`
              ),
              questionText: createTrans(
                `Which statement represents a direct observation of the bottle in hot water?`,
                `Pernyataan manakah yang menunjukkan pemerhatian langsung botol di dalam air panas?`,
                `以下哪项陈述代表对热水中的瓶子的直接观察？`
              ),
              options: [
                createTrans(`Heating air particles makes them expand and move faster.`, `Pemanasan zarah udara menjadikannya mengembang dan bergerak lebih cepat.`, `加热空气微粒使其膨胀并移动得更快。`),
                createTrans(`The balloon inflates and stands upright in hot water.`, `Belon mengembung dan berdiri tegak di dalam air panas.`, `热水中的气球膨胀并竖立起来。`),
                createTrans(`The thermal conduction of the plastic bottle is very high.`, `Kekonduksian haba botol plastik tersebut adalah sangat tinggi.`, `塑料瓶的热传导率非常高。`),
                createTrans(`Cold water has a higher atmospheric pressure than hot water.`, `Air sejuk mempunyai tekanan atmosfera yang lebih tinggi daripada air panas.`, `冷水具有比热水更高的气压。`)
              ],
              correctIndex: 1,
              explanation: createTrans(
                `We can visually watch the balloon inflate and stand upright (direct observation). Explaining that heated particles expand or discussing air pressure are scientific theories/inferences.`,
                `Kita boleh melihat secara visual belon mengembung dan tegak (pemerhatian langsung). Menjelaskan zarah mengembang ialah teori/inferens saintifik.`,
                `我们可以直观地观察到气球膨胀并竖立（直接观察）。解释加热颗粒膨胀或讨论气压属于科学理论/推论。`
              )
            });
          } else {
            list.push({
              id,
              skill,
              difficulty: diff,
              scenario: createTrans(
                `A student places 10 ${anim.en} in the middle of a covered plastic tray. One half of the tray is kept completely dark, while the other half is illuminated by a lamp. After 15 minutes, the student counts 9 ${anim.en} in the dark half and only 1 in the lit half.`,
                `Seorang murid meletakkan 10 ekor ${anim.ms} di bahagian tengah dulang plastik bertutup. Separuh dulang dikekalkan gelap sepenuhnya, manakala separuh lagi diterangi oleh lampu. Selepas 15 minit, murid tersebut mengira 9 ekor ${anim.ms} di bahagian gelap dan hanya 1 ekor di bahagian terang.`,
                `一名学生将 10 只${anim.zh}放在一个有盖塑料托盘的中间。托盘的一半保持完全黑暗，而另一半由灯光照明。15分钟后，该学生在黑暗的一半中数到 9 只${anim.zh}，而在亮的一半中只数到 1 只。`
              ),
              questionText: createTrans(
                `What is the most accurate direct observation recorded at the 15th minute?`,
                `Apakah pemerhatian langsung paling tepat yang direkodkan pada minit ke-15?`,
                `在第 15 分钟记录的最准确直接观察是什么？`
              ),
              options: [
                createTrans(`${anim.en} prefer dark places because of natural survival instincts.`, `${anim.ms} lebih menyukai tempat gelap kerana naluri survival daripada pemangsa.`, `${anim.zh}因天然避敌生存本能而更喜欢阴暗的地方。`),
                createTrans(`There are 9 ${anim.en} counted in the dark half and 1 in the lit half.`, `Terdapat 9 ekor ${anim.ms} dikira di bahagian gelap dan 1 ekor di bahagian terang.`, `黑暗的一半中有 9 只${anim.zh}，而亮的一半中只有 1 只。`),
                createTrans(`The lamp emits light rays that are harmful to biological sight.`, `Lampu memancarkan sinar cahaya yang berbahaya kepada penglihatan hidupan.`, `电灯发出的光线对生物的视觉有害。`),
                createTrans(`Dark environments have more food resources for ${anim.en}.`, `Persekitaran gelap mempunyai lebih banyak sumber makanan untuk ${anim.ms}.`, `黑暗环境为${anim.zh}提供了更丰富的食物资源。`)
              ],
              correctIndex: 1,
              explanation: createTrans(
                `Counting 9 objects on one side and 1 on the other are direct objective numerical facts (observation). Speculating about survival choices or light being harmful are explanations (inferences).`,
                `Mengira 9 objek di satu sisi dan 1 di sebelah lagi ialah fakta berangka objektif (pemerhatian). Membuat teori tentang naluri kemandirian ialah inferens.`,
                `在黑暗那侧数到 9 只并在一侧数到 1 只是直接的客观数字事实（观察）。而关于生存选择或光线有害等推论是解释（推断）。`
              )
            });
          }
        } else if (diff === 'medium') {
          list.push({
            id,
            skill,
            difficulty: diff,
            scenario: createTrans(
              `A group of scientific students heat ${100 + val1}ml of water using a Bunsen burner. They record the temperature in Celsius (ºC) every 2 minutes. The readings are: 0 min (30ºC), 2 mins (48ºC), 4 mins (66ºC), 6 mins (84ºC), 8 mins (100ºC), 10 mins (100ºC).`,
              `Sekumpulan murid sains memanaskan ${100 + val1}ml air menggunakan penunu Bunsen. Mereka merekodkan suhu dalam Celsius (ºC) setiap 2 minit. Bacaannya ialah: 0 min (30ºC), 2 min (48ºC), 4 min (66ºC), 6 min (84ºC), 8 min (100ºC), 10 min (100ºC).`,
              `一组科学学生使用本生灯加热 ${100 + val1} 毫升的水。他们每2分钟记录一次摄氏度（ºC）温度。读数为：0分钟（30ºC）、2分钟（48ºC）、4分钟（66ºC）、6分钟（84ºC）、8分钟（100ºC）、10分钟（100ºC）。`
            ),
            questionText: createTrans(
              `Which is the correct scientific observation regarding the temperature of the water from the 8th minute onwards?`,
              `Apakah pemerhatian saintifik yang betul mengenai suhu air tersebut dari minit ke-8 dan seterusnya?`,
              `关于第8分钟及以后水的温度，最正确的科学观察是什么？`
            ),
            options: [
              createTrans(`The temperature of water rises steadily.`, `Suhu air meningkat secara konsisten.`, `水的温度稳步上升。`),
              createTrans(`The temperature remains constant at 100ºC.`, `Suhu air kekal tetap pada 100ºC.`, `水的温度保持在 100ºC 不变。`),
              createTrans(`The water has completely converted into gas.`, `Air telah bertukar sepenuhnya menjadi gas.`, `水已经完全转化为气体。`),
              createTrans(`The thermometer is malfunctioning.`, `Termometer tersebut telah rosak.`, `温度计发生故障。`)
            ],
            correctIndex: 1, // remains constant at 100C
            explanation: createTrans(
              `The data clearly shows that at both 8 minutes and 10 minutes, the temperature reading is 100ºC. Therefore, the observation is that the temperature remains constant.`,
              `Data menunjukkan dengan jelas bahawa pada minit ke-8 dan minit ke-10, bacaan suhu adalah 100ºC. Oleh itu, pemerhatiannya ialah suhu air kekal malar.`,
              `数据清楚地显示，在第8分钟和第10分钟，温度读数均为 100ºC。因此，观察结果是温度保持恒定。`
            )
          });
        } else {
          // advanced
          list.push({
            id,
            skill,
            difficulty: diff,
            scenario: createTrans(
              `An investigator tests the acidity of ${sub.en} using a pH sensor and blue litmus paper. The pH read sensor displays 3.6. The blue litmus paper turns red instantly. Another test of plain water reads 7.0 and doesn't change the paper.`,
              `Seorang penyiasat menguji keasidan ${sub.ms} menggunakan penderia pH dan kertas litmus biru. Penderia pH menunjukkan bacaan 3.6. Kertas litmus biru bertukar merah serta-merta. Ujian lain dengan air suling menunjukkan 7.0 dan tidak menukar kertas tersebut.`,
              `一名研究人员使用 pH 传感器和蓝色石蕊试纸测试${sub.zh}的酸性。pH 传感器显示读数为 3.6。蓝色石蕊试纸立即变红。另一项对纯净水的测试显示读数为 7.0 且试纸未发生变化。`
            ),
            questionText: createTrans(
              `Based on these recorded results, what solid comparative observation can be made?`,
              `Berdasarkan keputusan yang direkodkan ini, apakah pemerhatian perbandingan kukuh yang boleh dibuat?`,
              `基于这些记录的结果，可以做出什么强有力的对比观察？`
            ),
            options: [
              createTrans(`${sub.en} is highly corrosive to biological tissue.`, `${sub.ms} adalah sangat mengakis kepada tisu biologi.`, `${sub.zh}对生物组织具有强腐蚀性。`),
              createTrans(`Liquid ${sub.en} has a lower pH value and changes blue litmus paper to red, unlike water.`, `Cecair ${sub.ms} mempunyai nilai pH yang lebih rendah dan menukarkan kertas litmus biru kepada merah, tidak seperti air.`, `与水不同，液体${sub.zh}的 pH 值较低，且能使蓝色石蕊试纸变红。`),
              createTrans(`All acidic solutions have a sweet sour taste of fruits.`, `Semua larutan berasid mempunyai rasa manis masam buah-buahan.`, `所有酸性溶液都具有水果的酸甜味。`),
              createTrans(`The blue litmus paper contains an alkaline layer dye.`, `Kertas litmus biru mengandungi pewarna lapisan beralkali.`, `蓝色石蕊试纸含有一种碱性染色剂。`)
            ],
            correctIndex: 1,
            explanation: createTrans(
              `An advanced observation accurately integrates both indicators (blue litmus paper turning red) and measured readings (pH 3.6 vs 7.0) objectively, without inserting speculative conclusions of corrosiveness.`,
              `Pemerhatian lanjutan menyepadukan kedua-dua penunjuk (kertas litmus biru bertukar merah) dan bacaan yang diukur (pH 3.6 berbanding 7.0) secara objektif tanpa spekulasi hakisan kasar.`,
              `高级观察能够客观地整合指标（蓝色石蕊试纸变红）和测量读数（pH 3.6 对比 7.0），而不添加关于腐蚀性的推测性结论。`
            )
          });
        }
        break;
      }
      case 'inference': {
        if (diff === 'easy') {
          list.push({
            id,
            skill,
            difficulty: diff,
            scenario: createTrans(
              `A student prepares two airtight jars. Jar A contains 5 living ${anim.en} with ample leafy food. Jar B also contains 5 identical ${anim.en} with food, but has a small open dish of sodium hydroxide which absorbs Carbon Dioxide and all moisture. After 1 day, the organisms in Jar A are very active, while those in Jar B have died.`,
              `Seorang murid menyediakan dua balang kedap udara. Balang A mengandungi 5 ekor ${anim.ms} yang hidup dengan makanan daun yang cukup. Balang B juga mengandungi 5 ekor ${anim.ms} yang serupa dengan makanan, tetapi mengandungi mangkuk kecil natrium hidroksida yang menyerap Karbon Dioksida dan semua kelembapan. Selepas 1 hari, organisma di Balang A sangat aktif, manakala yang di Balang B telah mati.`,
              `一个学生准备了两个密封瓶。A瓶装有5只活的${anim.zh}和充足的叶片食物。B瓶也装有5只相同的${anim.zh}和食物，但放了一个盛有氢氧化钠的小敞口盘，用来吸收二氧化碳和所有水分。1天后，A瓶中的生物非常活跃，而B瓶中的生物已经死亡。`
            ),
            questionText: createTrans(
              `State the most logical inference for the wilted state and death of the organisms in Jar B.`,
              `Nyatakan inferens yang paling logik bagi keadaan lemah dan kematian organisma di Balang B.`,
              `指出B瓶中生物虚弱和死亡最合乎逻辑的推断。`
            ),
            options: [
              createTrans(`The organisms in Jar B ran out of oxygen to breathe.`, `Organisma di Balang B kehabisan oksigen untuk bernafas.`, `B瓶中的生物消耗完了呼吸所需的氧气。`),
              createTrans(`The organisms in Jar B died because of the toxic lack of moisture/essential air balance.`, `Organisma di Balang B mati disebabkan kekurangan kelembapan/keseimbangan udara penting yang bertoksik.`, `B瓶中的生物死亡是由于缺乏水分/空气平衡，导致生存环境恶化。`),
              createTrans(`Jar A has a larger physical volume than Jar B.`, `Balang A mempunyai isi padu fizikal yang lebih besar daripada Balang B.`, `A瓶的物理体积大于B瓶。`),
              createTrans(`The organisms inside Jar B were already infected before starting.`, `Organisma di dalam Balang B telah dijangkiti sebelum kajian bermula.`, `B瓶中的生物在实验开始前已经受到感染。`)
            ],
            correctIndex: 1, // lack of essential moisture/air balance
            explanation: createTrans(
              `An inference is a scientific explanation for an observation. In this case, the moisture and gas absorbing agent altered vital environmental parameters, proving they require a balanced moist clean air environment.`,
              `Inferens ialah penjelasan saintifik untuk sesuatu pemerhatian. Dalam kes ini, agen penyerap kelembapan dan gas mengubah parameter persekitaran penting, membuktikan mereka memerlukan persekitaran udara lembap bersih yang seimbang.`,
              `推断是对观察结果的科学解释。在这种情况下，水分和气体吸收剂改变了至关重要的环境参数，证明它们需要一个平衡、湿润且清洁的空气环境。`
            )
          });
        } else if (diff === 'medium') {
          list.push({
            id,
            skill,
            difficulty: diff,
            scenario: createTrans(
              `In a materials lab, three rods made of Copper, Iron, and Glass of the exact physical lengths are coated with thin paraffin wax at their far ends. The rods are heated uniformly from the opposite tip. The wax on the Copper rod melts in ${val1} seconds, the Iron rod wax melts in ${val1 + 45} seconds, while the glass rod wax remains solid even after 5 minutes.`,
              `Dalam makmal bahan, tiga rod yang diperbuat daripada Gangsa, Besi, dan Kaca dengan panjang fizikal yang sama disalut lilin parafin nipis di hujung jauh. Rod-rod tersebut dipanaskan secara seragam dari hujung bertentangan. Lilin pada rod Gangsa mencair dalam ${val1} saat, rod Besi mencair dalam ${val1 + 45} saat, manakala lilin rod kaca kekal pepejal walaupun selepas 5 minit.`,
              `在材料实验室中，三根相同物理长度的铜、铁、玻璃棒在远端涂有薄薄的石蜡。从相反的一端均匀加热这些棒。铜棒上的蜡在 ${val1} 秒内熔化，铁棒上的蜡在 ${val1 + 45} 秒内熔化，而玻璃棒上的蜡即使在5分钟后仍保持固态。`
            ),
            questionText: createTrans(
              `What is the best scientific inference for the difference in melting time of the wax on these rods?`,
              `Apakah inferens saintifik terbaik bagi perbezaan masa pencairan lilin pada rod-rod tersebut?`,
              `对于这些棒上蜡熔化时间差异的最佳科学推断是什么？`
            ),
            options: [
              createTrans(`Copper is a superior conductor of heat compared to Iron, while Glass is an insulator of heat.`, `Gangsa ialah konduktor haba yang lebih baik berbanding Besi, manakala Kaca ialah penebat haba.`, `与铁相比，铜是更优异的导热体；而玻璃是热的不良导体。`),
              createTrans(`The Bunsen flame was directed closer towards the Copper rod.`, `Api Bunsen diarahkan lebih dekat ke arah rod Gangsa.`, `本生灯火焰更靠近铜棒。`),
              createTrans(`Iron has higher mass density than Glass and Copper.`, `Besi mempunyai ketumpatan jisim yang lebih tinggi berbanding Kaca dan Gangsa.`, `铁的质量密度高于玻璃和铜。`),
              createTrans(`Paraffin wax reacts chemically with metal ions during heating.`, `Lilin parafin bertindak balas secara kimia dengan ion logam semasa pemanasan.`, `石蜡在加热时与金属离子发生化学反应。`)
            ],
            correctIndex: 0,
            explanation: createTrans(
              `The observation is the wax melting speed. The logical scientific inference explains this via the material property: Copper conducts heat faster than Iron, whereas Glass conducts heat poorly.`,
              `Pemerhatian ialah kelajuan pencairan lilin. Inferens saintifik yang logik menjelaskan ini melalui sifat bahan: Gangsa mengalirkan haba lebih cepat daripada Besi, manakala Kaca adalah pengalir yang lemah.`,
              `观察结果是蜡的熔化速度。合乎逻辑的科学推断通过材料特性解释了这一点：铜传热比铁快，而玻璃导热性能差。`
            )
          });
        } else {
          // advanced
          list.push({
            id,
            skill,
            difficulty: diff,
            scenario: createTrans(
              `In an ecological study near an industrial zone, researchers record that the biodiversity count of macroinvertebrates in River Segment A (upstream of factory) is 45 species. In River Segment B (directly downstream of factory discharge), only 4 highly-tolerant worm species are observed. Additionally, the dissolved oxygen level in B is ${val1}% lower than upstream.`,
              `Dalam kajian ekologi berhampiran zon perindustrian, penyelidik merekodkan bahawa bilangan biodiversiti makroinvertebrat di Segmen Sungai A (hulu kilang) ialah 45 spesies. Di Segmen Sungai B (hilir aliran keluar kilang), hanya 4 spesies cacing yang mempunyai toleransi tinggi dilihat. Di samping itu, tahap oksigen terlarut dalam B adalah ${val1}% lebih rendah daripada hulu sungai.`,
              `在一项靠近工业区的生态研究中，研究人员记录了河流 A 段（工厂上游）的大型无脊椎动物生物多样性数量为 45 种。在河流 B 段（工厂污水直接排放的下游），仅观察到4种高耐受性蠕虫。此外，B 段的溶解氧水平比上游低 ${val1}%。`
            ),
            questionText: createTrans(
              `Formulate an advanced inference that clarifies the ecological discrepancy between upstream and downstream sections.`,
              `Formulasikan inferens lanjutan yang menjelaskan percanggahan ekologi antara bahagian hulu dan hilir sungai.`,
              `做出一个高级推断，阐明上游和下游河段之间的生态差异。`
            ),
            options: [
              createTrans(`Macroinvertebrates naturally swim upstream to avoid strong currents.`, `Makroinvertebrat secara semula jadi berenang ke hulu untuk mengelakkan arus kuat.`, `大型无脊椎动物自然会游向上游以避开强水流。`),
              createTrans(`Downstream aquatic organisms have migrated permanently to search of dry terrain.`, `Organisma akuatik hilir telah berhijrah secara kekal untuk mencari kawasan kering.`, `下游的水生生物已永久迁移，以寻找干燥的陆地。`),
              createTrans(`Industrial waste discharged into Segment B introduced organic pollutants, leading to bacterial depletion of dissolved oxygen which kills sensitive species.`, `Sisa industri yang dialirkan ke Segmen B memperkenalkan bahan pencemar organik, menyebabkan pengurangan oksigen terlarut oleh bakteria yang membunuh spesies sensitif.`, `排入 B 段的工业废水引入了有机污染物，导致细菌消耗溶解氧，从而杀死了敏感物种。`),
              createTrans(`River Segment B contains more natural minerals that selectively attract worm populations.`, `Segmen Sungai B mengandungi lebih banyak mineral semula jadi yang menarik populasi cacing secara terpilih.`, `Rivers B 段含有更多自然矿物质，选择性地吸引了蠕虫种群。`)
            ],
            correctIndex: 2,
            explanation: createTrans(
              `This advanced inference connects the observed facts (biodiversity plunge, oxygen plunge, factory discharge location) with the underlying biological mechanism (biodegradation consuming oxygen, suffocating sensitive organisms).`,
              `Inferens lanjutan ini mengaitkan fakta pemerhatian (penurunan biodiversiti, penurunan oksigen, lokasi pelepasan kilang) dengan mekanisma biologi (biodegradasi menggunakan oksigen, melemaskan organisma sensitif).`,
              `该高级推断将观察到的事实（生物多样性骤减、溶解氧骤减、工厂排放口位置）与潜在的生物学机制（生物降解消耗氧气，使敏感生物窒息）联系起来。`
            )
          });
        }
        break;
      }
      case 'hypothesis': {
        if (diff === 'easy') {
          list.push({
            id,
            skill,
            difficulty: diff,
            scenario: createTrans(
              `An agronomy group measures how fast grass grows under different ambient temperatures. They test at 15ºC, 25ºC, and 35ºC. They observe that as temperature increases within this range, the daily stem extension height increases as well.`,
              `Sekumpulan agroni mengukur seberapa cepat rumput bertumbuh di bawah suhu ambien yang berbeza. Mereka menguji pada 15ºC, 25ºC, dan 35ºC. Mereka mendapati bahawa apabila suhu meningkat dalam julat ini, kadar pertumbuhan tinggi batang harian juga meningkat.`,
              `一个农艺学小组测量了草在不同环境温度下的生长速度。他们在 15ºC、25ºC 和 35ºC 进行了测试。他们观察到，在此范围内，随着温度升高，每日茎伸长的高度也随之增加。`
            ),
            questionText: createTrans(
              `State a suitable hypothesis expressing this scientific relationship.`,
              `Nyatakan hipotesis yang sesuai untuk menerangkan hubungan saintifik ini.`,
              `提出一个表达这种科学关系的合适假设。`
            ),
            options: [
              createTrans(`Warmer air causes soil to evaporate water rapidly.`, `Udara yang hangat menyebabkan tanah menyejat air dengan cepat.`, `较温暖的空气导致土壤水分快速蒸发。`),
              createTrans(`The higher the environmental temperature, the higher the daily growth rate of the grass.`, `Semakin tinggi suhu persekitaran, semakin tinggi kadar pertumbuhan harian rumput tersebut.`, `环境温度越高，草的每日生长速率越高。`),
              createTrans(`Grass cannot grow at absolute zero temperatures.`, `Rumput tidak boleh bertumbuh pada suhu sifar mutlak.`, `草在绝对零度下无法生长。`),
              createTrans(`Temperature is measured using a calibrated celsius scale.`, `Suhu diukur menggunakan skala celsius yang ditentukur.`, `温度是使用标定的摄氏标度来测量的。`)
            ],
            correctIndex: 1, // the higher ..., the higher ...
            explanation: createTrans(
              `A basic hypothesis follows the standard format: "The (direction property) the manipulated variable, the (direction property) the responding variable."`,
              `Satu hipotesis asas mengikut format standard: "Semakin (arah sifat) pemboleh ubah dimanipulasikan, semakin (arah sifat) pemboleh ubah bergerak balas."`,
              `一个基础假设遵循的标准格式：“（操作性变量）越……，（反应性变量）就越……”`
            )
          });
        } else if (diff === 'medium') {
          list.push({
            id,
            skill,
            difficulty: diff,
            scenario: createTrans(
              `Physicists want to investigate electromagnet strength. They wrap insulated wire around an iron nail. They test strength by shifting the count of wire coils: 10 loops, 20 loops, and 30 loops. They record how many metal paperclips the magnet can lift. Findings: 10 loops (3 clips), 20 loops (7 clips), 30 loops (12 clips).`,
              `Ahli fizik ingin menyiasat kekuatan elektromagnet. Mereka melilit dawai berpenebat pada paku besi. Mereka menguji kekuatan dengan mengubah bilangan lilitan dawai: 10 lilitan, 20 lilitan, dan 30 lilitan. Mereka merekodkan berapa banyak klip kertas logam yang boleh ditarik. Penemuan: 10 lilitan (3 klip), 20 lilitan (7 klip), 30 lilitan (12 klip).`,
              `物理学家想要研究电磁铁的强度。他们将绝缘导线缠绕在铁钉上。他们通过改变线圈圈数来测试强度：10圈、20圈和30圈。他们记录了电磁铁可以吸起多少个金属回形针。结果：10圈（3个）、20圈（7个）、30圈（12个）。`
            ),
            questionText: createTrans(
              `Formulate the best hypothesis linking the independent (manipulated) variable with the dependent (responding) variable.`,
              `Formulasikan hipotesis terbaik yang menghubungkan pemboleh ubah bebas (dimanipulasi) dengan pemboleh ubah bersandar (bergerak balas).`,
              `制定一个连接自变量（操作性变量）与因变量（反应性变量）的最佳假设。`
            ),
            options: [
              createTrans(`If the current is increased, the temperature of the nail increases.`, `Jika arus elektrik ditingkatkan, suhu paku akan meningkat.`, `如果增加电流，铁钉的温度会升高。`),
              createTrans(`The electromagnet is stronger than a permanent static bar magnet.`, `Elektromagnet adalah lebih kuat daripada magnet bar statik kekal.`, `电磁铁比永久静态条形磁铁更强。`),
              createTrans(`As the number of wire coils wraps increases, the magnetic strength (number of paperclips attracted) increases.`, `Semakin bertambah bilangan lilitan dawai, semakin bertambah kekuatan magnet (bilangan klip kertas yang tertarik).`, `随着线圈绕数增加，电磁强度（吸引的回形针数量）也随之增加。`),
              createTrans(`Iron nails can be easily magnetised using electrical induction.`, `Paku besi boleh dimagnetkan dengan mudah menggunakan induksi elektrik.`, `通过电感应可以很容易地使铁钉磁化。`)
            ],
            correctIndex: 2,
            explanation: createTrans(
              `Hypotheses must explicitly connect the manipulated variable (number of wire coils) with the responding variable (magnetic strength/paperclips attracted) showing a clear testable direction.`,
              `Hipotesis mestilah menghubungkan pemboleh ubah dimanipulasi (bilangan lilitan) dengan pemboleh ubah bergerak balas (kekuatan magnet/bilangan klip kertas ditarik) menunjukkan arah yang boleh diuji secara jelas.`,
              `假设必须明确连接操作性变量（线圈圈数）与反应性变量（磁性强度/吸引的回形针数），并显示出清晰的可测试方向。`
            )
          });
        } else {
          // advanced
          list.push({
            id,
            skill,
            difficulty: diff,
            scenario: createTrans(
              `Biochemists study enzymes. They measure how the rate of starch hydrolysis changes at different pH levels (from acid pH 2 to alkaline pH 11). They notice that starch breakdown rate increases until pH 7 (neutral), but drops steeply as pH moves towards extreme acidic or alkaline environments.`,
              `Ahli biokimia mengkaji enzim. Mereka mengukur bagaimana kadar hidrolisis kanji berubah pada tahap pH berbeza (dari pH asid 2 ke pH alkali 11). Mereka mendapati kadar penguraian kanji meningkat sehingga pH 7 (neutral), tetapi menurun secara drastik apabila pH bergerak ke arah asid atau alkali melampau.`,
              `生物化学家研究酶。他们测量了淀粉水解速率在不同 pH 水平（从酸性 pH 2 到碱性 pH 11）下的变化。他们注意到淀粉分解速率在 pH 7（中性）之前一直增加，但随着 pH 向极酸性或极碱性环境转移而急剧下降。`
            ),
            questionText: createTrans(
              `Select the most advanced, testable hypothesis that encompasses this non-linear, multi-directional relationship.`,
              `Pilih hipotesis lanjutan yang boleh diuji untuk merangkumi hubungan tidak linear dan pelbagai arah ini.`,
              `选择最先进、可测试的假设，以涵盖这种非线性、多方向的关系。`
            ),
            options: [
              createTrans(`As the pH increases from acidic, starch always decomposes faster.`, `Apabila pH meningkat daripada berasid, kanji sentiasa terurai dengan lebih cepat.`, `随着 pH 值从酸性增加，淀粉分解得更快。`),
              createTrans(`The chemical activity of amylase is highest at neutral pH 7, and decreases in both acidic and alkaline mediums.`, `Aktiviti kimia amilase adalah paling tinggi pada pH neutral 7, dan berkurangan dalam kedua-dua medium asid dan alkali.`, `淀粉酶的化学活性在中性 pH 值 7 时最高，而在酸性和碱性介质中均会降低。`),
              createTrans(`All organic enzymes are chemically inactivated by neutral liquids.`, `Semua enzim organik dinyahaktifkan secara kimia oleh cecair neutral.`, `所有有机酶均会被中性液体化学灭活。`),
              createTrans(`pH levels represent the concentration of hydrogen ions in organic buffers.`, `Tahap pH mewakili kepekatan ion hidrogen dalam penimbal organik.`, `pH 水平代表有机缓冲液中氢离子的浓度。`)
            ],
            correctIndex: 1,
            explanation: createTrans(
              `For advanced non-linear relationships (hump-shaped curves like enzyme activity), a hypothesis must designate an optimum peak point or clarify that the trend shifts direction beyond a critical value.`,
              `Bagi hubungan bukan linear yang lanjutan (seperti lengkung aktiviti enzim), sesuatu hipotesis mestilah menyatakan titik kemuncak optimum atau menjelaskan bahawa corak bertukar arah selepas nilai kritikal.`,
              `对于高级非线性关系（如酶活性的山峰形曲线），假设必须指出一个最佳峰值点，或阐明在临界值之外趋势会改变方向。`
            )
          });
        }
        break;
      }
      case 'variables': {
        if (diff === 'easy') {
          list.push({
            id,
            skill,
            difficulty: diff,
            scenario: createTrans(
              `An agricultural scientist monitors the mass of tomatoes produced. He uses three plots of identical sandy soil, and injects different amounts of organic nitrogen fertiliser (0g, 50g, and 100g) into each. The tomato crop size is measured at harvest.`,
              `Seorang saintis pertanian memantau jisim tomato yang dihasilkan. Dia menggunakan tiga plot tanah pasir yang serupa, dan memberikan kuantiti baja nitrogen organik yang berbeza (0g, 50g, dan 100g) ke dalam setiap satu. Berat tuaian tomato diukur semasa menuai.`,
              `一位农业科学家监测番茄的产量质量。他使用了三块相同的沙质土壤地，并在每块土地中分别施入不同数量的有机氮肥（0克、50克和100克）。在收获时测量番茄的总质量。`
            ),
            variablesSetup: {
              manipulated: 'Amount of organic nitrogen fertiliser',
              responding: 'Mass of tomatoes harvested',
              constant: 'Type of sandy soil / plant species'
            },
            questionText: createTrans(
              `In this agricultural study, identify the Manipulated Variable (Independent Variable).`,
              `Dalam kajian pertanian ini, kenal pasti Pemboleh Ubah Dimanipulasikan (Pemboleh Ubah Bebas).`,
              `在这项农业研究中，确定操作性变量（自变量）。`
            ),
            options: [
              createTrans(`The temperature of harvesting days.`, `Suhu semasa hari-hari penuaian.`, `收获期的气温。`),
              createTrans(`The mass of tomatoes harvested.`, `Jisim tomato yang dituai.`, `收获的番茄质量。`),
              createTrans(`The type of soil used in pots.`, `Jenis tanah yang digunakan dalam pasu.`, `花盆中使用的土壤类型。`),
              createTrans(`The amount of organic nitrogen fertiliser used.`, `Jumlah baja nitrogen organik yang digunakan.`, `施用的有机氮肥数量。`)
            ],
            correctIndex: 3,
            explanation: createTrans(
              `The Manipulated Variable (Independent Variable) is the condition deliberately varied by the investigator at the start. Here, it is the fertilizer dose (0g, 50g, 100g).`,
              `Pemboleh Ubah Dimanipulasikan (Pemboleh Ubah Bebas) ialah faktor yang sengaja diubah oleh pengukur di permulaan. Di sini, ia adalah dos baja (0g, 50g, 100g).`,
              `操作性变量（自变量）是研究人员在开始时特意改变的条件。这里，它是肥料的使用量（0克、50克、100克）。`
            )
          });
        } else if (diff === 'medium') {
          list.push({
            id,
            skill,
            difficulty: diff,
            scenario: createTrans(
              `Medical engineers test how liquid viscosity speeds up piping flow. They fill three separate pipes with water, cooking oil, and thick honey respectively. They release ${val1}ml of each fluid through physical vertical cylinders and record the time in seconds for the liquid level to empty. They ensure the pipes have identical interior diameters and heights.`,
              `Jurutera perubatan menguji bagaimana kelikatan cecair mempengaruhi kelajuan aliran paip. Mereka mengisi tiga paip berasingan dengan air, minyak masak, dan madu pekat masing-masing. Mereka mengalirkan ${val1}ml setiap cecair melalui silinder menegak yang sama dan merekodkan masa dalam saat untuk cecair mengalir keluar sepenuhnya. Mereka memastikan paip mempunyai diameter dalam dan ketinggian yang serupa.`,
              `医疗工程师测试液体黏度如何影响在管道中的流动速度。他们分别用等体积的水、食用油和浓蜂蜜填充三根独立的管道。他们让每个管道释放 ${val1} 毫升的流体，并记录液面排空所需的时间（秒）。他们确保管道具有相同的内径和高度。`
            ),
            variablesSetup: {
              manipulated: 'Type of fluid (viscosity)',
              responding: 'Time taken for fluid level to empty',
              constant: 'Pipes interior diameter and height'
            },
            questionText: createTrans(
              `State the Constant Variable (Control Variable) and Responding Variable (Dependent Variable) for this experimental test.`,
              `Nyatakan Pemboleh Ubah Dimalarkan (Pemboleh Ubah Kawalan) dan Pemboleh Ubah Bergerak Balas (Pemboleh Ubah Bersandar) bagi ujian eksperimen ini.`,
              `指出这项实验测试的控制变量（恒定变量）和反应变量（因变量）。`
            ),
            options: [
              createTrans(`Constant: Fluid velocity. Responding: Viscosity value.`, `Dimalarkan: Halaju bendalir. Bergerak balas: Nilai kelikatan.`, `控制变量：流体速度。反应变量：黏度值。`),
              createTrans(`Constant: Pipe interior diameter & height. Responding: Time taken to empty.`, `Dimalarkan: Diameter dalam & ketinggian paip. Bergerak balas: Masa yang diambil untuk mengalir keluar.`, `控制变量：管道内径和高度。反应变量：排空所需的时间。`),
              createTrans(`Constant: Density of Honey. Responding: Room air temperature.`, `Dimalarkan: Ketumpatan Madu. Bergerak balas: Suhu bilik udara.`, `控制变量：蜂蜜的密度。反应变量：室内空气温度。`),
              createTrans(`Constant: Emptying duration. Responding: Pipe chemical compound material.`, `Dimalarkan: Tempoh pengosongan. Bergerak balas: Bahan sebatian kimia paip.`, `控制变量：排空持续时间。反应变量：管道化学复合材料。`)
            ],
            correctIndex: 1,
            explanation: createTrans(
              `Constant variables are held identical to isolate active effects. Here, pipe size is constant. Responding variables measure physical outcomes – here, the time taken for fluid to drain.`,
              `Pemboleh ubah dimalarkan dikekalkan sama untuk mengasingkan kesan aktif. Di sini, saiz paip dimalarkan. Pemboleh ubah bergerak balas mengukur hasil fizikal – iaitu masa yang diambil cecair untuk mengalir keluar.`,
              `为了排除外界干扰，控制变量必须保持相同。这里，管道尺寸是恒定的。反应变量测量物理结果——即流体排空所需的时间。`
            )
          });
        } else {
          // advanced
          list.push({
            id,
            skill,
            difficulty: diff,
            scenario: createTrans(
              `Metallurgists measure electrical resistance (ohms) of metal wires. They use three variables: the wire alloy composition, wire cross-sectional thickness ($0.5\\text{ mm}^2$ to $2.0\\text{ mm}^2$), and a constant test wire length of 1.0 meter and ambient room temperature of 25ºC. They observe that as wire thickness increases, the resistance drops.`,
              `Pakar metalurgi mengukur rintangan elektrik (ohm) dawai logam. Mereka menggunakan tiga faktor: komposisi aloi dawai, ketebalan keratan rentas dawai ($0.5\\text{ mm}^2$ hingga $2.0\\text{ mm}^2$), serta mengekalkan panjang dawai ujian pada 1.0 meter dan suhu bilik ambien pada 25ºC. Mereka mendapati bahawa apabila ketebalan dawai bertambah, rintangan elektrik berkurang.`,
              `冶金学家测量金属导线的电阻（欧姆）。他们使用了三个变量：导线的合金成分、导线的横截面积厚度（$0.5\\text{ mm}^2$ 到 $2.0\\text{ mm}^2$），并保持测试导线的长度恒定为 1.0 米，环境室温为 25ºC。他们观察到，随着导线厚度增加，电阻下降。`
            ),
            questionText: createTrans(
              `Why is it critical to keep the wire length and temperature strictly constant during this scientific study?`,
              `Mengapakah sangat kritikal untuk mengekalkan panjang dawai dan suhu bilik secara tegar sepanjang kajian ini?`,
              `为什么在这项科学研究中，保持导线长度和温度严格恒定至关重要？`
            ),
            options: [
              createTrans(`Because length and temperature are responding parameters which are mathematically derivative.`, `Kerana panjang dan suhu ialah parameter bergerak balas yang merupakan derivatif matematik.`, `因为长度和温度是数学上衍生的反应参数。`),
              createTrans(`To prevent length and temperature from acting as confounding independent variables that interfere with the measured resistance outcome.`, `Untuk mengelakkan panjang dawai dan suhu daripada bertindak sebagai pemboleh ubah bebas pengacau yang mengganggu rintangan ralat yang diukur.`, `防止长度和温度作为混杂自变量，干扰测量电阻的结果。`),
              createTrans(`To allow the scientist to vary wire alloy composition in real-time.`, `Untuk membolehkan saintis menukar komposisi aloi dawai dalam masa nyata.`, `使科学家能够实时改变导线合金成分。`),
              createTrans(`A shorter wire creates dangerous high-voltage electrical sparks.`, `Dawai yang lebih pendek menghasilkan percikan elektrik voltan tinggi yang berbahaya.`, `较短的导线会产生危险的高压电火花。`)
            ],
            correctIndex: 1,
            explanation: createTrans(
              `In rigorous experiments, all potential independent variables besides the main manipulated one must be held strictly constant as control variables. This guarantees any change in resistance is solely due to wire thickness.`,
              `Dalam eksperimen yang ketat, semua pemboleh ubah bebas berpotensi selain pemboleh ubah dimanipulasi utama mestilah dimalarkan dengan ketat sebagai pemboleh ubah kawalan bagi menjamin rintangan berpunca daripada ketebalan dawai semata-mata.`,
              `在严格的实验中，除主要操作变量外的所有其他潜在自变量都必须作为控制变量保持严格恒定。这保证了电阻的任何变化完全是由于导线厚度引起的。`
            )
          });
        }
        break;
      }
      case 'operational_definition': {
        if (diff === 'easy') {
          list.push({
            id,
            skill,
            difficulty: diff,
            scenario: createTrans(
              `Class 4 Science students want to define 'rusting'. They place iron nails in different tubes: tube A (naked nail with water and air) and tube B (painted nail with water and air). After 1 week, the naked nail in tube A is coated with a reddish-brown substance, while tube B is smooth.`,
              `Murid Sains Kelas 4 ingin mendefinisikan 'pengaratan'. Mereka memasukkan paku besi ke dalam tiub yang berbeza: tiub A (paku bogel dengan air dan udara) dan tiub B (paku dicat dengan air dan udara). Selepas 1 minggu, paku bogel di tiub A disaluti bahan perang kemerahan, manakala tiub B kekal licin.`,
              `四年级科学学生想要定义“生锈”。他们将铁钉放入不同的试管中：试管 A（无涂层铁钉，有水和空气）和试管 B（有漆面涂层铁钉，有水和空气）。1周后，试管 A 中的无涂层铁钉表面覆盖了一层红褐色物质，而试管 B 中的铁钉依然平滑。`
            ),
            questionText: createTrans(
              `What is the operational definition of rusting of an iron nail?`,
              `Apakah definisi secara operasi bagi pengaratan paku besi?`,
              `铁钉生锈的操作性定义是什么？`
            ),
            options: [
              createTrans(`Rusting is liquid oxidation creating metal decay.`, `Pengaratan ialah pengoksidaan cecair menghasilkan pereputan logam.`, `生锈是液体氧化导致金属腐蚀。`),
              createTrans(`Rusting is what happens when iron reacts with oxygen and water to form hydrated iron oxide.`, `Pengaratan ialah apa yang berlaku apabila besi bertindak balas dengan oksigen dan air untuk membentuk ferum oksida terhidrat.`, `生锈是铁与氧气和水反应形成水合氧化铁的过程。`),
              createTrans(`The operational definition of rusting is the formation of a reddish-brown substance on the iron nail after one week.`, `Definisi secara operasi bagi pengaratan ialah pembentukan bahan perang kemerahan pada paku besi selepas satu minggu.`, `生锈的操作性定义是一周后铁钉上形成红褐色物质。`),
              createTrans(`Rusting is prevented by painting or oiling metal nails.`, `Pengaratan boleh dicegah dengan mengecat atau menyapu minyak pada paku logam.`, `通过涂漆或给金属钉上油可以防止生锈。`)
            ],
            correctIndex: 2,
            explanation: createTrans(
              `An operational definition must state exactly *what is done* (placing iron nails in conditions for a week) and *what is observed* (formation of the reddish-brown substance). Conceptual chemical explanations are scientific definitions, not operational definitions.`,
              `Definisi secara operasi mestilah menyatakan dengan tepat *apa yang dilakukan* dan *apa yang diperhatikan* (pembentukan bahan perang kemerahan). Penjelasan kimia konseptual ialah definisi saintifik konseptual, bukannya definisi secara operasi.`,
              `操作性定义必须明确指出“做什么”（放置铁钉一周）和“观察到什么”（形成红褐色物质）。概念性的化学解释是科学定义，而不是操作性定义。`
            )
          });
        } else if (diff === 'medium') {
          list.push({
            id,
            skill,
            difficulty: diff,
            scenario: createTrans(
              `Biologists measure yeast fermentation rate. They mix sugar, yeast, and warm water in a conical flask, seal it with a delivery tube leading into a glass cylinder measuring displaced water volume. Bubbles form and displace water. They test three sugar concentrations and record how many milliliters of water are displaced per minute.`,
              `Ahli biologi mengukur kadar fermentasi yis. Mereka mencampurkan gula, yis, dan air suam di dalam kelalang kon, menutupnya dan menyambungkannya dengan tiub penghantar ke silinder untuk mengukur isi padu air yang disesarkan. Buih terbentuk dan menyasarkan air. Mereka mengalirkan tiga kepekatan gula dan merekodkan mililiter air yang disesarkan seminit.`,
              `生物学家测量酵母发酵速率。他们在锥形瓶中混合糖、酵母和温水，用一根连通玻璃量筒的导管将其密封，以测量排出的水体积。气泡形成并排出水。他们测试了三种糖浓度，并记录每分钟排出多少毫升水。`
            ),
            questionText: createTrans(
              `Which option expresses the correct operational definition of 'yeast fermentation rate' in this experimental setup?`,
              `Pilihan manakah menyatakan definisi secara operasi yang betul bagi 'kadar fermentasi yis' dalam susunan eksperimen ini?`,
              `在这个实验装置中，以下哪个选项表达了“酵母发酵速率”的正确操作性定义？`
            ),
            options: [
              createTrans(`Yeast fermentation rate is the biological process of anaerobic respiration generating carbon dioxide gas.`, `Kadar fermentasi yis ialah proses biologi respirasi anaerobik yang menghasilkan gas karbon dioksida.`, `酵母发酵速率是厌氧呼吸产生二氧化碳气体的生物过程。`),
              createTrans(`Yeast fermentation rate is defined by the absolute number of active single-celled yeast organisms in the flask.`, `Kadar fermentasi yis didefinisikan oleh jumlah mutlak organisma yis sel tunggal yang aktif di dalam kelalang.`, `酵母发酵速率由锥形瓶中活性单细胞酵母生物的绝对数量定义。`),
              createTrans(`The operational definition of yeast fermentation rate is the volume of water displaced in the glass cylinder per minute (ml/min).`, `Definisi secara operasi bagi kadar fermentasi yis ialah isi padu air yang disesarkan di dalam silinder kaca seminit (ml/min).`, `酵母发酵速率的操作性定义是量筒中每分钟排出的水体积（毫升/分钟）。`),
              createTrans(`Yeast works fastest of all when combined with heavy glucose syrups active in warmer air.`, `Yis bertindak paling cepat apabila digabungkan dengan sirap glukosa pekat aktif dalam udara yang hangat.`, `与在较暖空气中具有活性的浓葡萄糖浆结合时，酵母的运作速度最快。`)
            ],
            correctIndex: 2,
            explanation: createTrans(
              `The operational definition states the specific physical variable measured (volume of water displaced per minute) to indicate the unobservable concept (yeast fermentation rate) in this setup.`,
              `Definisi secara operasi menyatakan pemboleh ubah fizikal spesifik yang diukur (isi padu air yang disesarkan seminit) untuk menunjukkan konsep yang tidak dapat dilihat secara terus (kadar fermentasi yis).`,
              `操作性定义指出了在此装置中测量的特定物理变量（每分钟排出的水体积），以指示无法直接观察的概念（酵母发酵速率）。`
            )
          });
        } else {
          // advanced
          list.push({
            id,
            skill,
            difficulty: diff,
            scenario: createTrans(
              `In a biomechanics laboratory, researchers examine 'muscle fatigue' in volunteers holding different heavy loaded dumbbells (2kg, 5kg, 10kg) with an outstretched arm horizontally. Electromyogram (EMG) sensors measure muscle signal amplitudes, while they record how many seconds the subject can maintain strict posture before their arm drops below 15 degrees.`,
              `Dalam makmal biomekanik, penyelidik mengkaji 'keletihan otot' dalam kalangan sukarelawan yang memegang beban dumbbell berbeza (2kg, 5kg, 10kg) secara mendatar. Penderia elektromiogram (EMG) mengukur amplitud isyarat otot, manakala mereka merekodkan bilangan saat subjek boleh mengekalkan postur tegak sebelum lengan jatuh melebihi 15 darjah.`,
              `在生物力学实验室中，研究人员测试了志愿者将手臂水平伸直提起不同重量哑铃（2公斤、5公斤、10公斤）时的“肌肉疲劳”程度。肌电图（EMG）传感器测量肌肉信号幅度，同时他们记录受试者在手臂下垂超过15度之前，自主保持严格姿势的持续时间（秒）。`
            ),
            questionText: createTrans(
              `Select the most complete operational definition of 'muscle fatigue' suited for this advanced ergonomic research.`,
              `Pilih definisi secara operasi bagi 'keletihan otot' yang paling lengkap untuk penyelidikan ergonomik lanjutan ini.`,
              `选择最完整且符合这项高级人体工程学研究的“肌肉疲劳”操作性定义。`
            ),
            options: [
              createTrans(`Muscle fatigue is the cellular accumulation of lactic acid when rate of respiration shifts.`, `Keletihan otot ialah pengumpulan asid laktik dalam sel apabila kadar respirasi berubah.`, `肌肉疲劳是当呼吸速率发生转变时，乳酸在细胞内的积累。`),
              createTrans(`Muscle fatigue is the feeling of physical exhaustion and muscle pain occurring when lifting dumbbells.`, `Keletihan otot ialah perasaan letih fizikal dan sakit otot yang berlaku apabila mengangkat dumbbell.`, `肌肉疲劳是提起哑铃时发生的身体疲惫感和肌肉酸痛。`),
              createTrans(`The operational definition of muscle fatigue is the time duration in seconds a subject can hold a dumbbell horizontally before their arm drops more than 15 degrees.`, `Definisi secara operasi bagi keletihan otot ialah tempoh masa dalam saat subjek boleh memegang dumbbell secara mendatar sebelum lengan jatuh melebihi 15 darjah.`, `肌肉疲劳的操作性定义是受试者能够水平举起哑铃，直到手臂下垂超过15度之前的持续时间（秒）。`),
              createTrans(`Muscle fatigue is measured on a computerized EMG visualizer running active digital monitors.`, `Keletihan otot diukur pada alat visualisasi EMG berkomputer yang menjalankan monitor digital aktif.`, `肌肉疲劳是在运行着数字显示器的电脑化 EMG 显像仪上测量的。`)
            ],
            correctIndex: 2,
            explanation: createTrans(
              `An operational definition must isolate a practical, observable criterion (holding dumbbell horizontally until arm drops >15 degrees, measured in seconds) that represents the elusive underlying biological strain.`,
              `Definisi secara operasi mestilah mengasingkan kriteria praktikal yang boleh diperhatikan (memegang dumbbell secara mendatar sehingga lengan jatuh >15 darjah, diukur dalam saat) yang mewakili ketegangan biologi dalaman.`,
              `操作性定义必须隔离出一个实用的、可观察的准则（水平举起哑铃直到手臂下垂超过15度，以秒衡量），以此代表抽象的内在生物学张力。`
            )
          });
        }
        break;
      }
      case 'interpreting_data': {
        const customGraphData = [
          { label: '0 min', value: 25 },
          { label: '2 min', value: 40 + val1 },
          { label: '4 min', value: 55 + val1 },
          { label: '6 min', value: 70 + val1 },
          { label: '8 min', value: 80 + val1 }
        ];

        if (diff === 'easy') {
          list.push({
            id,
            skill,
            difficulty: diff,
            graphData: customGraphData,
            scenario: createTrans(
              `A water purification test charts how turbidity (dirtiness, in NTU) decreases over filtration layers (0 to 4 carbon filters). The records show: 0 layers (80 NTU), 1 layer (55 NTU), 2 layers (32 NTU), 3 layers (15 NTU), 4 layers (4 NTU).`,
              `Ujian penulenan air memaparkan bagaimana kekeruhan (kekotoran, dalam NTU) berkurang mengikut lapisan penapisan (0 hingga 4 penapis karbon). Rekod menunjukkan: 0 lapisan (80 NTU), 1 lapisan (55 NTU), 2 lapisan (32 NTU), 3 lapisan (15 NTU), 4 lapisan (4 NTU).`,
              `一项水净化测试记录了水浊度（脏污程度，单位为 NTU）随过滤层数（0 至 4 层碳过滤器）增加而降低的情况。记录显示：0层（80 NTU）、1层（55 NTU）、2层（32 NTU）、3层（15 NTU）、4层（4 NTU）。`
            ),
            questionText: createTrans(
              `Based on these turbidity values, what is the clear general trend of the water dirtiness as the number of filtration layers increases?`,
              `Berdasarkan nilai kekeruhan ini, apakah corak umum kekotoran air apabila bilangan lapisan penapisan bertambah?`,
              `根据这些浊度值，随着过滤层数增加，水脏污程度的明显总体趋势是什么？`
            ),
            options: [
              createTrans(`The turbidity increases.`, `Kekeruhan air bertambah.`, `浊度增加。`),
              createTrans(`The turbidity decreases.`, `Kekeruhan air berkurang.`, `浊度降低。`),
              createTrans(`The turbidity remains unchanged at 32 NTU.`, `Kekeruhan air kekal tidak berubah pada 32 NTU.`, `浊度保持在 32 NTU 不变。`),
              createTrans(`The turbidity fluctuates and rises eventually.`, `Kekeruhan air berubah-ubah dan akhirnya meningkat.`, `浊度呈波动状态，最终上升。`)
            ],
            correctIndex: 1,
            explanation: createTrans(
              `Interpreting data requires recognizing spatial/numerical patterns. The dataset clearly shows a consistent decline in turbidity values (80 -> 55 -> 32 -> 15 -> 4) as filter layer counts rise.`,
              `Mentafsir data memerlukan pengecaman corak ruangan atau nombor. Set data menunjukkan dengan jelas penurunan konsisten dalam nilai kekeruhan (80 -> 55 -> 32 -> 15 -> 4) apabila bilangan lapisan penapis dilaporkan meningkat.`,
              `解释数据需要识别空间/数字模式。该数据集清楚地显示，随着过滤器层数增加，浊度值呈持续下降趋势（80 -> 55 -> 32 -> 15 -> 4）。`
            )
          });
        } else if (diff === 'medium') {
          list.push({
            id,
            skill,
            difficulty: diff,
            graphData: [
              { label: 'pH 3', value: 2 },
              { label: 'pH 5', value: 12 },
              { label: 'pH 7', value: 28 },
              { label: 'pH 9', value: 14 },
              { label: 'pH 11', value: 1 }
            ],
            scenario: createTrans(
              `An ecologist observes plant leaf sprout counts in different garden soil pH conditions. The collected records are: Soil pH 3 (2 leaves), pH 5 (12 leaves), pH 7 (28 leaves), pH 9 (14 leaves), pH 11 (1 leaf).`,
              `Seorang ahli ekologi memerhati jumlah tunas daun tumbuhan dalam keadaan pH tanah taman yang berbeza. Rekod yang dikumpul adalah: pH Tanah 3 (2 daun), pH 5 (12 daun), pH 7 (28 daun), pH 9 (14 daun), pH 11 (1 daun).`,
              `一位生态学家观察了不同花园土壤 pH 条件下植物叶芽的数量。收集到的记录如下：土壤 pH 3（2片叶子）、pH 5（12片叶子）、pH 7（28片叶子）、pH 9（14片叶子）、pH 11（1片叶子）。`
            ),
            questionText: createTrans(
              `Draw the most accurate conclusion regarding the optimal soil soil pH for the plant growth based on this specific dataset.`,
              `Sediakan kesimpulan paling tepat mengenai pH tanah yang optimum untuk pertumbuhan tumbuhan berdasarkan set data spesifik ini.`,
              `根据这一特定数据集，关于植物生长的最佳土壤 pH 值，得出最准确的结论。`
            ),
            options: [
              createTrans(`Plants grow best in strongly acidic soil (pH 3).`, `Tumbuhan bertumbuh paling baik dalam tanah berasid kuat (pH 3).`, `植物在强酸性土壤（pH 3）中生长最好。`),
              createTrans(`Plants grow best in highly alkaline soil (pH 11).`, `Tumbuhan bertumbuh paling baik dalam tanah beralkali tinggi (pH 11).`, `植物在强碱性土壤（pH 11）中生长最好。`),
              createTrans(`The plant growth rate decreases uniformly from pH 3 to pH 11.`, `Kadar pertumbuhan tumbuhan menurun secara seragam dari pH 3 ke pH 11.`, `从 pH 3 到 pH 11，植物的生长速率均匀下降。`),
              createTrans(`Plants grow best in neutral soil (pH 7), and growth decreases in both acidic and alkaline environments.`, `Tumbuhan bertumbuh paling baik dalam tanah neutral (pH 7), dan pertumbuhan berkurang dalam kedua-dua keadaan asid dan alkali.`, `植物在中性土壤（pH 7）中生长最好，而在酸性和碱性环境中生长都会受阻。`)
            ],
            correctIndex: 3,
            explanation: createTrans(
              `The data peaks sharply at pH 7 (28 leaves) and tapers down in both directions (pH 3 has 2, pH 11 has 1). This indicates neutral pH is optimal, whereas acidity or alkalinity retards growth.`,
              `Data menunjukkan kemuncak pada pH 7 (28 daun) dan menyusut di kedua-dua arah (pH 3 mendapat 2, pH 11 mendapat 1). Ini menunjukkan pH neutral adalah paling optimum, manakala keasidan atau kealkalian membantunkan pertumbuhan.`,
              `数据在 pH 7 处出现峰值（28片叶子），并向两个方向递减（pH 3 为 2片，pH 11 为 1片）。这表明中性 pH 值是最佳的，而酸性或碱性都会抑制生长。`
            )
          });
        } else {
          // advanced
          list.push({
            id,
            skill,
            difficulty: diff,
            graphData: [
              { label: '0m', value: 100 },
              { label: '100m', value: 85 },
              { label: '200m', value: 45 },
              { label: '300m', value: 12 },
              { label: '400m', value: 12 }
            ],
            scenario: createTrans(
              `Oceanographers measure light intensity percentage in seawater at varying depths: 0 meters (100%), 100 meters (85%), 200 meters (45%), 300 meters (12%), 400 meters (12%). At the same time, they observe coral density distribution in colonies per square meter: 0m (15), 100m (13), 200m (6), 300m (0), 400m (0).`,
              `Pakar oseanografi mengukur peratusan keamatan cahaya dalam air laut pada kedalaman berbeza: 0 meter (100%), 100 meter (85%), 200 meter (45%), 300 meter (12%), 400 meter (12%). Pada masa yang sama, mereka mengukur ketumpatan terumbu karang per meter persegi: 0m (15), 100m (13), 200m (6), 300m (0), 400m (0).`,
              `海洋学家测量了不同深度海水中的光照强度百分比：0米（100%）、100米（85%）、200米（45%）、300米（12%）、400米（12%）。同时，他们观察了每平方米珊瑚群落的珊瑚密度分布：0米（15个）、100米（13个）、200米（6个）、300米（0个）、400米（0个）。`
            ),
            questionText: createTrans(
              `Analyze the correlation between depth, light intensity, and coral density to formulate the most comprehensive conclusion.`,
              `Analisis korelasi antara kedalaman, keamatan cahaya, dan ketumpatan terumbu karang untuk menyediakan kesimpulan paling menyeluruh.`,
              `分析深度、光照强度与珊瑚密度之间的相关性，以得出最全面的结论。`
            ),
            options: [
              createTrans(`Coral density increases at greater depth regardless of lighting levels.`, `Ketumpatan terumbu karang bertambah pada kedalaman lebih tinggi tanpa mengira keamatan cahaya.`, `无论光照水平如何，随着深度增加，珊瑚密度都会增加。`),
              createTrans(`Light intensity and depth are positively correlated, creating higher coral populations.`, `Keamatan cahaya dan kedalaman berkorelasi positif, menghasilkan populasi terumbu karang yang lebih tinggi.`, `光照强度与深度正相关，从而带来更高的珊瑚种群分布。`),
              createTrans(`Deep water ocean layers have uniform light concentration and attract more predatory fish.`, `Lapisan lautan dalam mempunyai kepekatan cahaya yang seragam dan menarik lebih banyak ikan pemangsa.`, `深水海洋层具有均匀的光线浓度，会吸引更多的捕食性鱼类。`),
              createTrans(`As depth increases, light intensity decreases, causing a corresponding drop in coral density because photosynthetic symbiotic algae within coral require light to survive.`, `Apabila kedalaman bertambah, keamatan cahaya berkurang, menyebabkan penurunan ketumpatan terumbu karang kerana alga simbiosis fotosintetik di dalam karang memerlukan cahaya untuk hidup.`, `随着深度增加，光照强度降低，导致珊瑚密度相应下降，因为珊瑚内的光合共生藻类需要光线才能存活。`)
            ],
            correctIndex: 3,
            explanation: createTrans(
              `An advanced interpretation involves synthesizing multiple related variables (depth, light value, cell density) and outlining the biological relationship (corals host photosynthetic algae, so a lack of light at greater depths prevents coral survival).`,
              `Pentafsiran lanjutan melibatkan sintesis beberapa pemboleh ubah berkaitan (kedalaman, nilai cahaya, ketumpatan terumbu) dan menerangkan korelasi biologi (karang menempatkan alga fotosintesis, oleh itu ketiadaan cahaya pada kedalaman lautan menghalang kemandirian karang).`,
              `高级数据解释涉及综合多个相关变量（深度、光强、珊瑚密度）并概述其生物学关系（珊瑚宿主光合藻类，因此在更深的海水中缺乏光照会阻碍珊瑚生存）。`
            )
          });
        }
        break;
      }
    }
  }

  // Double check list length to verify we have exactly 15 questions per skill
  return list;
}

/**
 * Returns the entire Question bank consisting of exactly 15 * 6 = 90 questions.
 */
export function getFullQuestionBank(): Question[] {
  const bank: Question[] = [];
  const skills: SPS_Skill[] = [
    'observation',
    'inference',
    'hypothesis',
    'variables',
    'operational_definition',
    'interpreting_data'
  ];

  skills.forEach(skill => {
    const questions = generateQuestionsForSkill(skill);
    bank.push(...questions);
  });

  return bank;
}

// Predefined missions list (Mission-Based Learning)
export const KEY_MISSIONS: Mission[] = [
  {
    id: 'm1',
    title: createTrans('Junior Inspector', 'Penyiasat Muda', '初级调查员'),
    desc: createTrans('Correctly pass 3 Easy questions in Observation.', 'Selesaikan 3 soalan Mudah dalam Pemerhatian dengan betul.', '正确回答3道关于观察（Observation）的简单问题。'),
    rewardXp: 150,
    targetSkill: 'observation',
    reqCount: 3,
    type: 'complete_quizzes'
  },
  {
    id: 'm2',
    title: createTrans('Master of Variables', 'Jaguh Pemboleh Ubah', '变量掌控者'),
    desc: createTrans('Correctly resolve 4 Medium details in Variables.', 'Selesaikan 4 soalan Sederhana dalam Pemboleh Ubah dengan betul.', '正确解答4道关于变量限制（Variables）的中等难度问题。'),
    rewardXp: 250,
    targetSkill: 'variables',
    reqCount: 4,
    type: 'complete_quizzes'
  },
  {
    id: 'm3',
    title: createTrans('The Great Theorist', 'Ahli Teori Terbilang', '伟大理论家'),
    desc: createTrans('Complete 3 Hypotheses on Advanced difficulty.', 'Selesaikan 3 soalan Hipotesis pada tahap Sukar.', '在假设（Hypothesis）下完成3道高难度问题。'),
    rewardXp: 400,
    targetSkill: 'hypothesis',
    reqCount: 3,
    type: 'complete_quizzes'
  },
  {
    id: 'm4',
    title: createTrans('Grand Scientist Certification', 'Sijil Saintis Pintar', '大科学家认证'),
    desc: createTrans('Succeed in answering a total of 15 questions across any skill.', 'Berjaya menjawab 15 soalan secara keseluruhan dalam mana-mana kemahiran.', '在任何技能中成功回答总计15道问题。'),
    rewardXp: 500,
    reqCount: 15,
    type: 'reach_xp' // customized checks handled in app
  }
];

// Predefined static leaderboard database of virtual students (enables simulation in dashboard)
export const VIRTUAL_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'v1', name: 'Zhi Hao Lin', avatar: 'avatar_male_1', level: 14, xp: 6200, schoolClass: 'Primary 5 Alpha' },
  { id: 'v2', name: 'Ahmad Faiz', avatar: 'avatar_male_2', level: 12, xp: 4850, schoolClass: 'Primary 5 Beta' },
  { id: 'v3', name: 'Sarah Tan', avatar: 'avatar_female_1', level: 11, xp: 4200, schoolClass: 'Primary 5 Alpha' },
  { id: 'v4', name: 'Darshini Nair', avatar: 'avatar_female_2', level: 9, xp: 3100, schoolClass: 'Primary 5 Gamma' },
  { id: 'v5', name: 'Chong Wei Min', avatar: 'avatar_male_3', level: 8, xp: 2200, schoolClass: 'Primary 5 Alpha' }
];

export const ALL_BADGES: Badge[] = [
  {
    id: 'first_step',
    name: createTrans('First Step', 'Langkah Pertama', '迈出第一步'),
    description: createTrans('Begin your scientific quest by correctly answering your very first question.', 'Mulakan perjalanan sains anda dengan menjawab soalan pertama dengan betul.', '正确回答你的第一个科学问题以开启科学探究。'),
    iconName: 'Compass',
    rarity: 'common'
  },
  {
    id: 'observer_badge',
    name: createTrans('Eagle Eye', 'Mata Helang', '鹰眼观察员'),
    description: createTrans('Complete 5 Observation quests to master spatial details.', 'Selesaikan 5 cabaran Pemerhatian untuk menguasai butiran fizikal.', '完成5次观察（Observation）探索以掌握观察细节。'),
    iconName: 'Eye',
    rarity: 'common'
  },
  {
    id: 'detective_badge',
    name: createTrans('Sherlock Analyst', 'Penganalisis Sherlock', '福尔摩斯推断者'),
    description: createTrans('Complete 5 Inference questions on why reactions happen.', 'Selesaikan 5 soalan Inferens tentang kenapa tindak balas berlaku.', '完成5个推断（Inference）问题，说明反应发生的原因。'),
    iconName: 'Search',
    rarity: 'rare'
  },
  {
    id: 'theorist_badge',
    name: createTrans('Quantum Theorist', 'Ahli Teori Quantum', '量子假设家'),
    description: createTrans('Get 5 Hypothesis queries matching cause and impact.', 'Kuasai 5 soalan Hipotesis yang memadankan sebab dan kesan dengan betul.', '正确解答5道关于假设（Hypothesis）的因果匹配题。'),
    iconName: 'Lightbulb',
    rarity: 'rare'
  },
  {
    id: 'control_master',
    name: createTrans('Architect of Control', 'Arkitek Kawalan', '控制变量建筑师'),
    description: createTrans('Resolve 5 Variables questionnaires perfectly.', 'Selesaikan 5 soalan Pemboleh Ubah dengan sempurna.', '完美解答5道关于变量（Variables）的问题。'),
    iconName: 'Sliders',
    rarity: 'epic'
  },
  {
    id: 'definer_badge',
    name: createTrans('Pristine Definer', 'Pendefinisi Jitu', '精准定义者'),
    description: createTrans('Succeed in 5 Operational Definition tasks.', 'Berjaya menyelesaikan 5 tugasan Definisi Secara Operasi.', '成功解答5道关于操作性定义（Operational Definition）的任务。'),
    iconName: 'BookOpen',
    rarity: 'epic'
  },
  {
    id: 'data_wizard',
    name: createTrans('Statistical Oracle', 'Peramal Statistik', '统计数据神谕'),
    description: createTrans('Complete 5 Interpreting Data challenges.', 'Selesaikan 5 cabaran Mentafsir Data.', '完成5道关于解释数据（Interpreting Data）的挑战。'),
    iconName: 'BarChart2',
    rarity: 'epic'
  },
  {
    id: 'halfway_there',
    name: createTrans('Apex Researcher', 'Penyelidik Elit', '精英研究员'),
    description: createTrans('Level up to level 5 as a qualified researcher.', 'Naik ke tahap 5 sebagai penyelidik bertauliah.', '升级至第5级，成为一名合格的研究者。'),
    iconName: 'ShieldAlert',
    rarity: 'legendary'
  },
  {
    id: 'sps_champion',
    name: createTrans('Master of Science', 'Jaguh Sains Terunggul', '顶级科学大师'),
    description: createTrans('Earn 2500 total XP on your account.', 'Kumpul 2500 jumlah mata XP keseluruhan pada akaun anda.', '在你的帐户中获得总计2500点XP。'),
    iconName: 'Crown',
    rarity: 'legendary'
  }
];
