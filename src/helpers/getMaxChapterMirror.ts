import { SourceType } from '../enum';
import { Manga, Mirror } from '../types/Manga';

type Props = (mirrors: Manga['mirrors']) => { source: SourceType; mirror: Mirror };

export const getMaxChapterMirror: Props = mirrors => {
    const tempArr = Object.entries(mirrors) as [SourceType, Mirror][];
    return tempArr.reduce<ReturnType<Props>>(
        (acc, [source, mirror]) => {
            if (mirror.lastChapter > acc.mirror.lastChapter) {
                return {
                    source,
                    mirror,
                };
            }
            return acc;
        },
        {
            source: tempArr[0][0],
            mirror: tempArr[0][1],
        }
    );
};
